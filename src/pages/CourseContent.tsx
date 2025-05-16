import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import AppLayout from '@/components/AppLayout';
import CustomButton from '@/components/ui/custom-button';
import { ArrowLeft, Book, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { verifyPurchase } from '@/utils/purchaseVerification';

interface Lesson {
  id: number;
  title: string;
  content: {
    type: 'text' | 'example' | 'exercise';
    content: string;
    examples?: string[];
    options?: string[];
    correctAnswer?: string;
  }[];
  completed: boolean;
}

const japaneseCourseContent: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Kanji",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Kanji (漢字) are the adopted logographic Chinese characters that are used in the Japanese writing system. They are used alongside the Japanese syllabic scripts hiragana and katakana. The Japanese term kanji for the Chinese characters literally means 'Han characters' and is written using the same characters as the Chinese word hànzì."
      },
      {
        type: 'text',
        content: "Kanji are used for writing nouns, adjectives, adverbs and verbs. Unlike the Chinese language, Japanese cannot be written entirely in kanji. For grammatical endings and words without corresponding kanji, two additional, syllable-based scripts are used: hiragana and katakana."
      },
      {
        type: 'example',
        content: "Basic Kanji Structure",
        examples: [
          "人 (ひと) - person",
          "木 (き) - tree",
          "水 (みず) - water",
          "火 (ひ) - fire"
        ]
      },
      {
        type: 'exercise',
        content: "Match the following kanji with their meanings:",
        options: ["person", "tree", "water", "fire"],
        correctAnswer: "person"
      }
    ]
  },
  {
    id: 2,
    title: "Numbers and Time",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Numbers in Japanese can be written using either kanji or Arabic numerals. The kanji for numbers are used in formal writing and traditional contexts. Let's learn the basic number kanji and how to express time."
      },
      {
        type: 'example',
        content: "Basic Number Kanji",
        examples: [
          "一 (いち) - one",
          "二 (に) - two",
          "三 (さん) - three",
          "四 (よん) - four",
          "五 (ご) - five"
        ]
      },
      {
        type: 'text',
        content: "Time expressions in Japanese use specific counters and particles. The basic structure is: [time] + 時 (じ) for hours, and [number] + 分 (ふん/ぷん) for minutes."
      },
      {
        type: 'example',
        content: "Time Expressions",
        examples: [
          "一時 (いちじ) - 1 o'clock",
          "二時半 (にじはん) - 2:30",
          "三時十五分 (さんじじゅうごふん) - 3:15"
        ]
      },
      {
        type: 'exercise',
        content: "What time is 四時四十五分?",
        options: ["4:15", "4:30", "4:45", "4:50"],
        correctAnswer: "4:45"
      }
    ]
  },
  {
    id: 3,
    title: "Basic Verbs",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Japanese verbs are typically written using a combination of kanji and hiragana. The kanji part usually represents the meaning, while the hiragana part indicates the verb conjugation. Let's learn some common verb kanji and their usage."
      },
      {
        type: 'example',
        content: "Common Verb Kanji",
        examples: [
          "行く (いく) - to go",
          "来る (くる) - to come",
          "食べる (たべる) - to eat",
          "飲む (のむ) - to drink",
          "見る (みる) - to see"
        ]
      },
      {
        type: 'text',
        content: "Verb conjugation in Japanese follows specific patterns. The basic forms are: dictionary form (辞書形), polite form (ます形), and negative form (ない形)."
      },
      {
        type: 'example',
        content: "Verb Conjugation Examples",
        examples: [
          "行く → 行きます → 行かない",
          "食べる → 食べます → 食べない",
          "見る → 見ます → 見ない"
        ]
      },
      {
        type: 'exercise',
        content: "What is the polite form of 飲む?",
        options: ["飲みます", "飲ます", "飲みる", "飲むます"],
        correctAnswer: "飲みます"
      }
    ]
  },
  {
    id: 4,
    title: "Daily Life Kanji",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Daily life kanji are essential for navigating everyday situations in Japan. These kanji appear frequently in signs, menus, and basic communication. Let's learn some of the most common ones."
      },
      {
        type: 'example',
        content: "Common Daily Life Kanji",
        examples: [
          "店 (みせ) - store/shop",
          "駅 (えき) - station",
          "電車 (でんしゃ) - train",
          "銀行 (ぎんこう) - bank",
          "学校 (がっこう) - school"
        ]
      },
      {
        type: 'text',
        content: "These kanji often appear in compound words, where two or more kanji are combined to create new meanings. Understanding the individual kanji helps in learning and remembering these compounds."
      },
      {
        type: 'example',
        content: "Compound Words",
        examples: [
          "地下鉄 (ちかてつ) - subway (underground + iron)",
          "図書館 (としょかん) - library (picture + book + building)",
          "郵便局 (ゆうびんきょく) - post office (mail + convenience + office)"
        ]
      },
      {
        type: 'exercise',
        content: "What does 図書館 mean?",
        options: ["school", "library", "bookstore", "museum"],
        correctAnswer: "library"
      }
    ]
  }
];

const CourseContent: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Verify purchase
  React.useEffect(() => {
    const checkPurchase = async () => {
      if (!publicKey) {
        setHasPurchased(false);
        setIsVerifying(false);
        return;
      }

      try {
        const courseIdNum = Number(courseId);
        const isPurchased = await verifyPurchase(publicKey, courseIdNum, 0.1); // Assuming all courses are 0.1 SOL for now
        setHasPurchased(isPurchased);
      } catch (error) {
        console.error('Error verifying purchase:', error);
        setHasPurchased(false);
      } finally {
        setIsVerifying(false);
      }
    };

    checkPurchase();
  }, [publicKey, courseId]);

  if (isVerifying) {
    return (
      <AppLayout>
        <div className="w-full max-w-3xl mx-auto text-center py-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Verifying Purchase</h1>
            <p className="text-gray-600">Please wait while we verify your course access...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!hasPurchased) {
    return (
      <AppLayout>
        <div className="w-full max-w-3xl mx-auto text-center py-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Locked</h1>
            <p className="text-gray-600 mb-6">Please purchase this course to access its content.</p>
            <CustomButton onClick={() => navigate('/contributor/marketplace')}>
              Return to Marketplace
            </CustomButton>
          </div>
        </div>
      </AppLayout>
    );
  }

  const currentLessonData = japaneseCourseContent[currentLesson];

  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentLesson]: answer
    }));
    setShowAnswers(prev => ({
      ...prev,
      [currentLesson]: true
    }));
  };

  const handleNextLesson = () => {
    if (currentLesson < japaneseCourseContent.length - 1) {
      setCurrentLesson(prev => prev + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(prev => prev - 1);
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <CustomButton
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            <ArrowLeft size={20} />
            Back to Course
          </CustomButton>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-purple-800">{currentLessonData.title}</h1>
              <span className="text-sm text-gray-500">Lesson {currentLesson + 1} of {japaneseCourseContent.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLesson + 1) / japaneseCourseContent.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {currentLessonData.content.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                {item.type === 'text' && (
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                )}

                {item.type === 'example' && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">{item.content}</h3>
                    <ul className="space-y-2">
                      {item.examples?.map((example, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ChevronRight className="text-purple-600" size={16} />
                          <span className="text-gray-700">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.type === 'exercise' && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">{item.content}</h3>
                    <div className="space-y-2">
                      {item.options?.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(option)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            showAnswers[currentLesson]
                              ? option === item.correctAnswer
                                ? 'bg-green-100 text-green-800'
                                : userAnswers[currentLesson] === option
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          disabled={showAnswers[currentLesson]}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {showAnswers[currentLesson] && (
                      <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg">
                        {userAnswers[currentLesson] === item.correctAnswer
                          ? "Correct! Well done!"
                          : `Incorrect. The correct answer is: ${item.correctAnswer}`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <CustomButton
              variant="secondary"
              onClick={handlePreviousLesson}
              disabled={currentLesson === 0}
            >
              Previous Lesson
            </CustomButton>
            <CustomButton
              variant="gradient-blue"
              onClick={handleNextLesson}
              disabled={currentLesson === japaneseCourseContent.length - 1}
            >
              Next Lesson
            </CustomButton>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseContent; 