import React, { useEffect, useRef, useState } from 'react'
import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer'
import { motion } from 'framer-motion'
import { BsArrowRight } from 'react-icons/bs'
//import { motion } from 'motion/react'
import axios from 'axios'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'

const ServerUrl = import.meta.env.VITE_SERVER_URL;
const Step2Interview = ({ interviewData, onFinish }) => {
  // const { interviewId, questions, username } = interviewData
  const {
    interviewId,
    questions = [],
    username = "Candidate"
  } = interviewData || {}

  const [isIntroPhase, setIsIntroPhase] = useState(true)

  const [isMicOn, setIsMicOn] = useState(true)
  const recognitionRef = useRef(null)
  const [isAIPlaying, setIsAIPlaying] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );

  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female")
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null)
  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        return;
      }
      //Try known female voices
      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("susan") ||
        v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      //try known male voice
      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  {/* Speak function */ }
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
      }
      window.speechSynthesis.cancel();

      //Add natural pauses after cammas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };
      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };
      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };
  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Welcome ${username || "Candidate"}! Let's start your interview. You will have 60 seconds to answer each question. Good luck!`)
        await speakText("I'll ask you few questions. Just answer them as best as you can. Don't worry about making mistakes, just be yourself and try to relax.")
        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(resolve => setTimeout(resolve, 800))

        //if last question
        if (currentIndex === questions.length - 1) {
          await speakText("This was the last question. Thank you for your time and good luck with your job application!")
        }
        await speakText(currentQuestion.question);
        if (isMicOn) {
          startMic();
        }
      }
    }
    runIntro();

  }, [selectedVoice, isIntroPhase, currentIndex])

  useEffect(() => {
    // ❌ intro ke time timer nahi chalega
    if (isIntroPhase) return;

    // ❌ question nahi hai to stop
    if (!currentQuestion) return;
    if (isSubmitting) {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentQuestion]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;

  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {

      }
    }
  }

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  }

  const submitAnswer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    stopMic();
    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
       // questionId: currentQuestion.id,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true });
      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false)
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }
    await speakText("Next question coming up.");
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) {
        startMic();
      }
    }, 500)

  }

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false)
    try {
      const result = await axios.post(`${ServerUrl}/api/interview/finish`, {
        interviewId
      }, { withCredentials: true });

      console.log("Interview finished:", result.data);
      onFinish(result.data);
    } catch (error) {
      console.error("Error finishing interview:", error);
    }
  }

  useEffect(() => {
    if(!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [isIntroPhase, currentQuestion])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    }
  }, [])

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50  via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350px min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/** Video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              className='w-full rounded-2xl overflow-hidden shadow-xl'
              src={videoSource}
              key={videoSource}
              ref={videoRef} />
          </div>

          {/*subtitle */}
          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}

          {/*timer */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500 '>
                Interview Status
              </span>
              {isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>
                {isAIPlaying ? "AI Speaking..." : ""}
              </span>}
            </div>
            <div className='h-px bg-gray-200'></div>

            <div className='flex justify-center'>
              <Timer 
              key={currentIndex}
              timeLeft={timeLeft} 
              totalTime={currentQuestion?.timeLimit || 60} />
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>

                <span className='text-sm text-gray-400'>Current Question</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-sm text-gray-400'>Total Questions</span>
              </div>
            </div>

          </div>
        </div>

        {/** Text section */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>AI Smart Interview</h2>

          {isIntroPhase && (
            <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-md'>
              <p className='text-xs sm:text-sm mb-2 text-gray-400'>{currentIndex + 1} of {questions.length}</p>
              <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed pr-16'>
                {currentQuestion?.question}
              </div>
            </div>
          )}
          <textarea
            className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800'
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer} />

          {!feedback ? (
            <div className='flex items-center gap-4 mt-6'>
              <motion.button
                onClick={toggleMic}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
                className='w-12 h-12 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>
              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting || isAIPlaying}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
                className='flex-1 bg-gradient-to-br from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500'
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}

              </motion.button>
            </div>) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
              <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
              <button
                onClick={handleNext}
                className='w-full bg-gradient-to-r flex items-center justify-center gap-1 from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition'>
                Next Question <BsArrowRight size={18} />
              </button>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview
