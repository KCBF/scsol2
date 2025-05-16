import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import AppLayout from '@/components/AppLayout';
import CustomButton from '@/components/ui/custom-button';
import { ArrowLeft, Book, Clock, Users, Award } from 'lucide-react';

interface CourseContent {
  title: string;
  description: string;
  duration: string;
}

interface Course {
  id: number;
  title: string;
  language: string;
  level: string;
  description: string;
  duration: string;
  lessons: number;
  students: number;
  price: number;
  content: CourseContent[];
}

interface Courses {
  [key: number]: Course;
}

// Dummy course data
const courses: Courses = {
  1: {
    id: 1,
    title: "100 Essential Spanish Nouns",
    language: "Spanish",
    level: "A1",
    description: "Master the most common Spanish nouns used in everyday conversation. This course covers essential vocabulary for beginners, including nouns for people, places, things, and concepts.",
    duration: "2 hours",
    lessons: 10,
    students: 1250,
    price: 0.1,
    content: [
      {
        title: "Introduction to Spanish Nouns",
        description: "Learn the basics of Spanish nouns and their gender rules",
        duration: "15 minutes"
      },
      {
        title: "Common People Nouns",
        description: "Essential nouns for describing people and relationships",
        duration: "20 minutes"
      },
      {
        title: "Place Nouns",
        description: "Important nouns for locations and places",
        duration: "20 minutes"
      },
      {
        title: "Object Nouns",
        description: "Common nouns for everyday objects",
        duration: "20 minutes"
      },
      {
        title: "Concept Nouns",
        description: "Abstract nouns and concepts",
        duration: "20 minutes"
      }
    ]
  },
  2: {
    id: 2,
    title: "Business English Phrases",
    language: "English",
    level: "B2",
    description: "Enhance your professional English communication with essential business phrases and expressions. Perfect for professionals looking to improve their workplace English.",
    duration: "3 hours",
    lessons: 12,
    students: 980,
    price: 0.1,
    content: [
      {
        title: "Business Meeting Phrases",
        description: "Essential phrases for conducting and participating in meetings",
        duration: "25 minutes"
      },
      {
        title: "Email Communication",
        description: "Professional email writing and common expressions",
        duration: "25 minutes"
      },
      {
        title: "Negotiation Language",
        description: "Key phrases for business negotiations",
        duration: "25 minutes"
      },
      {
        title: "Presentation Skills",
        description: "Phrases for effective business presentations",
        duration: "25 minutes"
      }
    ]
  },
  3: {
    id: 3,
    title: "Japanese Kanji Basics",
    language: "Japanese",
    level: "N5",
    description: "Start your journey into Japanese writing with fundamental Kanji characters. Learn the most common Kanji used in daily life and basic communication.",
    duration: "4 hours",
    lessons: 15,
    students: 2100,
    price: 0.1,
    content: [
      {
        title: "Introduction to Kanji",
        description: "Understanding Kanji structure and basic rules",
        duration: "30 minutes"
      },
      {
        title: "Numbers and Time",
        description: "Essential Kanji for numbers and time expressions",
        duration: "30 minutes"
      },
      {
        title: "Basic Verbs",
        description: "Common Kanji used in basic verbs",
        duration: "30 minutes"
      },
      {
        title: "Daily Life Kanji",
        description: "Kanji characters for everyday objects and activities",
        duration: "30 minutes"
      }
    ]
  },
  101: {
    id: 101,
    title: "Complete Spanish Course Bundle",
    language: "Spanish",
    level: "A1-C1",
    description: "Comprehensive Spanish learning package covering all levels from beginner to advanced. Includes grammar, vocabulary, conversation practice, and cultural insights.",
    duration: "40 hours",
    lessons: 50,
    students: 3500,
    price: 0.35,
    content: [
      {
        title: "Spanish Fundamentals",
        description: "Basic grammar and essential vocabulary",
        duration: "2 hours"
      },
      {
        title: "Intermediate Grammar",
        description: "Complex sentence structures and verb tenses",
        duration: "2 hours"
      },
      {
        title: "Advanced Conversation",
        description: "Fluency practice and complex expressions",
        duration: "2 hours"
      },
      {
        title: "Cultural Immersion",
        description: "Understanding Spanish culture and customs",
        duration: "2 hours"
      }
    ]
  },
  102: {
    id: 102,
    title: "Business English Mastery",
    language: "English",
    level: "B2-C1",
    description: "Advanced business English course designed for professionals. Master business communication, negotiation, and presentation skills.",
    duration: "30 hours",
    lessons: 40,
    students: 2800,
    price: 0.45,
    content: [
      {
        title: "Advanced Business Writing",
        description: "Professional document writing and email communication",
        duration: "2 hours"
      },
      {
        title: "Executive Communication",
        description: "High-level business communication skills",
        duration: "2 hours"
      },
      {
        title: "International Business",
        description: "Cross-cultural communication and global business practices",
        duration: "2 hours"
      },
      {
        title: "Leadership Communication",
        description: "Effective communication for leaders and managers",
        duration: "2 hours"
      }
    ]
  },
  103: {
    id: 103,
    title: "Japanese Immersion Pack",
    language: "Japanese",
    level: "N5-N3",
    description: "Comprehensive Japanese learning package covering basic to intermediate levels. Includes Kanji, grammar, conversation, and cultural understanding.",
    duration: "50 hours",
    lessons: 60,
    students: 4200,
    price: 0.4,
    content: [
      {
        title: "Basic Japanese Structure",
        description: "Essential grammar and sentence patterns",
        duration: "2 hours"
      },
      {
        title: "Kanji Mastery",
        description: "Comprehensive Kanji learning system",
        duration: "2 hours"
      },
      {
        title: "Conversation Practice",
        description: "Real-world Japanese conversation skills",
        duration: "2 hours"
      },
      {
        title: "Cultural Context",
        description: "Understanding Japanese culture and customs",
        duration: "2 hours"
      }
    ]
  },
  5: {
    id: 5,
    title: "Vietnamese for English Speakers",
    language: "Vietnamese",
    level: "A1",
    description: "A comprehensive course for English speakers to learn Vietnamese, covering the alphabet, tones, greetings, numbers, essential phrases, and Vietnamese culture.",
    duration: "3 hours",
    lessons: 12,
    students: 800,
    price: 0.1,
    content: [
      { title: "Vietnamese Alphabet and Pronunciation", description: "Learn the Vietnamese alphabet and how to pronounce each letter and tone.", duration: "20 minutes" },
      { title: "Basic Greetings and Introductions", description: "Essential greetings and how to introduce yourself in Vietnamese.", duration: "15 minutes" },
      { title: "Numbers, Dates, and Time", description: "Counting, telling the time, and expressing dates in Vietnamese.", duration: "15 minutes" },
      { title: "Essential Phrases for Travelers", description: "Key phrases for travel, shopping, and emergencies.", duration: "20 minutes" },
      { title: "Vietnamese Food and Culture", description: "Explore Vietnamese cuisine and cultural customs.", duration: "20 minutes" }
    ]
  },
  6: {
    id: 6,
    title: "English for Vietnamese Speakers",
    language: "English",
    level: "A1",
    description: "A detailed course for Vietnamese speakers to learn English, focusing on pronunciation, grammar, common phrases, numbers, and travel situations.",
    duration: "3 hours",
    lessons: 12,
    students: 950,
    price: 0.1,
    content: [
      { title: "English Alphabet and Pronunciation", description: "Master the English alphabet and difficult sounds for Vietnamese speakers.", duration: "20 minutes" },
      { title: "Basic English Grammar", description: "Learn the basics of English sentence structure and articles.", duration: "15 minutes" },
      { title: "Common English Phrases", description: "Useful phrases for daily communication.", duration: "15 minutes" },
      { title: "Numbers, Dates, and Time in English", description: "How to use numbers, tell the time, and express dates in English.", duration: "20 minutes" },
      { title: "English for Travel and Shopping", description: "Essential English for travel, shopping, and asking for help.", duration: "20 minutes" }
    ]
  }
};

const CourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const course = courses[Number(courseId)];

  if (!course) {
    return (
      <AppLayout>
        <div className="w-full max-w-3xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h1>
          <CustomButton onClick={() => navigate(role === 'learner' ? '/marketplace' : '/contributor/marketplace')}>
            Return to Marketplace
          </CustomButton>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <CustomButton
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => navigate(role === 'learner' ? '/marketplace' : '/contributor/marketplace')}
          >
            <ArrowLeft size={20} />
            Back to Marketplace
          </CustomButton>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {course.language}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {course.level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{course.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Book className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Lessons</p>
                <p className="font-medium">{course.lessons} lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="font-medium">{course.students.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-600">{course.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.content.map((lesson: CourseContent, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="text-purple-600" size={24} />
              <span className="font-medium">Course Purchased</span>
            </div>
            <CustomButton
              variant="gradient-blue"
              onClick={() => navigate(`/course/${courseId}/learn`)}
            >
              Start Learning
            </CustomButton>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetails; 