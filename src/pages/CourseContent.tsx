import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRole } from '@/context/RoleContext';
import AppLayout from '@/components/AppLayout';
import CustomButton from '@/components/ui/custom-button';
import { ArrowLeft, Book, CheckCircle, ChevronRight } from 'lucide-react';

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

const spanishCourseContent: Lesson[] = [
  {
    id: 1,
    title: "Basic Nouns and Articles",
    completed: false,
    content: [
      {
        type: 'text',
        content: "In Spanish, every noun has a gender (masculine or feminine) and a number (singular or plural). The articles 'el' (masculine) and 'la' (feminine) are used with singular nouns, while 'los' (masculine) and 'las' (feminine) are used with plural nouns."
      },
      {
        type: 'example',
        content: "Common Nouns with Articles",
        examples: [
          "el libro (the book) - masculine singular",
          "la mesa (the table) - feminine singular",
          "los libros (the books) - masculine plural",
          "las mesas (the tables) - feminine plural"
        ]
      },
      {
        type: 'text',
        content: "Generally, nouns ending in -o are masculine, while those ending in -a are feminine. However, there are many exceptions to this rule."
      },
      {
        type: 'exercise',
        content: "Which article would you use with 'casa' (house)?",
        options: ["el", "la", "los", "las"],
        correctAnswer: "la"
      }
    ]
  },
  {
    id: 2,
    title: "Family Members",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Family vocabulary is essential for basic conversation in Spanish. These nouns are commonly used in daily life and help you describe relationships."
      },
      {
        type: 'example',
        content: "Family Members",
        examples: [
          "el padre (father)",
          "la madre (mother)",
          "el hermano (brother)",
          "la hermana (sister)",
          "el abuelo (grandfather)",
          "la abuela (grandmother)"
        ]
      },
      {
        type: 'text',
        content: "Note that some family members have different words for masculine and feminine forms, while others change only the article."
      },
      {
        type: 'exercise',
        content: "What is the Spanish word for 'sister'?",
        options: ["hermano", "hermana", "padre", "madre"],
        correctAnswer: "hermana"
      }
    ]
  },
  {
    id: 3,
    title: "Food and Drinks",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Food vocabulary is crucial for ordering in restaurants, shopping, and daily conversation. Spanish cuisine is diverse, and knowing these words will help you navigate menus and markets."
      },
      {
        type: 'example',
        content: "Common Food Items",
        examples: [
          "el pan (bread)",
          "la leche (milk)",
          "el agua (water)",
          "la fruta (fruit)",
          "el café (coffee)",
          "la carne (meat)"
        ]
      },
      {
        type: 'text',
        content: "Many food items in Spanish are countable nouns, which means they can be used in both singular and plural forms."
      },
      {
        type: 'exercise',
        content: "Which of these is a drink?",
        options: ["pan", "leche", "carne", "fruta"],
        correctAnswer: "leche"
      }
    ]
  },
  {
    id: 4,
    title: "Places and Locations",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Knowing the names of different places is essential for navigation and daily life in Spanish-speaking countries. These nouns help you find your way around and describe locations."
      },
      {
        type: 'example',
        content: "Common Places",
        examples: [
          "el restaurante (restaurant)",
          "la escuela (school)",
          "el hospital (hospital)",
          "la biblioteca (library)",
          "el parque (park)",
          "la tienda (store)"
        ]
      },
      {
        type: 'text',
        content: "When using these nouns with prepositions like 'en' (in) or 'a' (to), remember to use the correct article."
      },
      {
        type: 'exercise',
        content: "Where would you go to read books?",
        options: ["restaurante", "biblioteca", "hospital", "tienda"],
        correctAnswer: "biblioteca"
      }
    ]
  }
];

const businessEnglishContent: Lesson[] = [
  {
    id: 1,
    title: "Professional Introductions",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Making a strong first impression in business settings is crucial. Professional introductions should be clear, concise, and include relevant information about your role and company."
      },
      {
        type: 'example',
        content: "Common Introduction Phrases",
        examples: [
          "I'm [Name], the [Position] at [Company].",
          "I work as a [Position] in the [Department].",
          "I've been with [Company] for [Time Period].",
          "I'm responsible for [Key Responsibilities]."
        ]
      },
      {
        type: 'text',
        content: "When introducing yourself, maintain eye contact, use a firm handshake, and speak clearly. Remember to listen actively when others introduce themselves."
      },
      {
        type: 'exercise',
        content: "Which is the most professional way to introduce yourself?",
        options: [
          "Hey, I'm John!",
          "Hi, I'm John from Marketing.",
          "Hello, I'm John Smith, Marketing Manager at ABC Corp.",
          "John here, nice to meet you!"
        ],
        correctAnswer: "Hello, I'm John Smith, Marketing Manager at ABC Corp."
      }
    ]
  },
  {
    id: 2,
    title: "Business Meetings",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Effective meeting communication is essential for professional success. This lesson covers key phrases for leading meetings, participating in discussions, and ensuring clear communication."
      },
      {
        type: 'example',
        content: "Meeting Phrases",
        examples: [
          "Let's get started with the agenda.",
          "I'd like to address the first point.",
          "Could you elaborate on that?",
          "Let's table this for now and move on.",
          "To summarize the key points..."
        ]
      },
      {
        type: 'text',
        content: "Active participation in meetings shows engagement and leadership potential. Use these phrases to contribute meaningfully to discussions."
      },
      {
        type: 'exercise',
        content: "What's the best way to ask for clarification in a meeting?",
        options: [
          "What do you mean?",
          "I don't understand.",
          "Could you please elaborate on that point?",
          "That doesn't make sense."
        ],
        correctAnswer: "Could you please elaborate on that point?"
      }
    ]
  },
  {
    id: 3,
    title: "Email Communication",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Professional email communication requires a balance of formality and clarity. Learn how to structure emails effectively and use appropriate language for different situations."
      },
      {
        type: 'example',
        content: "Email Opening and Closing Phrases",
        examples: [
          "Dear [Name],",
          "I hope this email finds you well.",
          "Thank you for your prompt response.",
          "Best regards,",
          "Looking forward to hearing from you."
        ]
      },
      {
        type: 'text',
        content: "Professional emails should be concise, clear, and action-oriented. Always proofread before sending and ensure you've included all necessary information."
      },
      {
        type: 'exercise',
        content: "Which is the most appropriate email closing?",
        options: [
          "Bye!",
          "Cheers,",
          "Best regards,",
          "See you later!"
        ],
        correctAnswer: "Best regards,"
      }
    ]
  },
  {
    id: 4,
    title: "Negotiation Language",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Effective negotiation requires clear communication and strategic language. Learn how to express your position, make proposals, and reach agreements professionally."
      },
      {
        type: 'example',
        content: "Negotiation Phrases",
        examples: [
          "We're looking for a mutually beneficial solution.",
          "What are your thoughts on this proposal?",
          "I understand your position, however...",
          "Let's find a middle ground.",
          "Would you consider an alternative approach?"
        ]
      },
      {
        type: 'text',
        content: "Successful negotiations require active listening, clear communication, and the ability to find common ground. Use these phrases to maintain a professional tone."
      },
      {
        type: 'exercise',
        content: "What's the best way to express disagreement in a negotiation?",
        options: [
          "That's not going to work.",
          "I completely disagree.",
          "I understand your position, however, we have some concerns.",
          "That's a bad idea."
        ],
        correctAnswer: "I understand your position, however, we have some concerns."
      }
    ]
  }
];

const japaneseKanjiContent: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Kanji",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Kanji (漢字) are the adopted logographic Chinese characters used in Japanese writing. They represent both meaning and sound, making them essential for reading and writing Japanese. Each Kanji can have multiple readings: on'yomi (Chinese reading) and kun'yomi (Japanese reading)."
      },
      {
        type: 'example',
        content: "Basic Kanji Structure",
        examples: [
          "人 (ひと/じん) - person/human",
          "日 (ひ/にち) - sun/day",
          "月 (つき/げつ) - moon/month",
          "火 (ひ/か) - fire"
        ]
      },
      {
        type: 'text',
        content: "Kanji are made up of radicals (部首), which are the basic building blocks. Understanding radicals helps in learning and remembering Kanji. For example, the radical 氵(water) appears in many water-related Kanji."
      },
      {
        type: 'exercise',
        content: "Which Kanji means 'person'?",
        options: ["日", "人", "月", "火"],
        correctAnswer: "人"
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
        content: "Numbers in Japanese can be written using either Kanji or Arabic numerals. The Kanji for numbers are used in formal writing and traditional contexts. Time expressions in Japanese use specific counters and particles."
      },
      {
        type: 'example',
        content: "Number Kanji",
        examples: [
          "一 (いち) - one",
          "二 (に) - two",
          "三 (さん) - three",
          "四 (よん/し) - four",
          "五 (ご) - five"
        ]
      },
      {
        type: 'text',
        content: "Time expressions use the counter 時 (じ) for hours and 分 (ふん/ぷん) for minutes. The basic structure is: [number] + 時 for hours, and [number] + 分 for minutes."
      },
      {
        type: 'exercise',
        content: "How do you write '3:30' in Japanese?",
        options: ["三時半", "三時三十分", "三時十五分", "三時四十五分"],
        correctAnswer: "三時半"
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
        content: "Japanese verbs are typically written using a combination of Kanji and Hiragana. The Kanji part usually represents the meaning, while the Hiragana part indicates the verb conjugation. This combination is called okurigana (送り仮名)."
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
        content: "Verb conjugation in Japanese follows specific patterns. The basic forms are: dictionary form (辞書形), polite form (ます形), and negative form (ない形). The Hiragana part changes to show these different forms."
      },
      {
        type: 'exercise',
        content: "What is the polite form of 食べる?",
        options: ["食べます", "食べるます", "食べまする", "食べるです"],
        correctAnswer: "食べます"
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
        content: "Daily life Kanji are essential for navigating everyday situations in Japan. These Kanji appear frequently in signs, menus, and basic communication. Understanding these characters will help you in daily activities."
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
        content: "Many Kanji can be combined to create compound words (熟語). For example, 電車 (train) combines 電 (electricity) and 車 (vehicle). Understanding the individual Kanji helps in learning and remembering these compounds."
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

const frenchConversationContent: Lesson[] = [
  {
    id: 1,
    title: "Basic Greetings and Introductions",
    completed: false,
    content: [
      {
        type: 'text',
        content: "French greetings vary depending on the time of day and formality level. Understanding these nuances is crucial for making a good first impression in French-speaking countries."
      },
      {
        type: 'example',
        content: "Common Greetings",
        examples: [
          "Bonjour (Good day) - Formal, any time",
          "Bonsoir (Good evening) - After 6 PM",
          "Salut (Hi) - Informal, any time",
          "Enchanté(e) (Nice to meet you) - When introduced",
          "Comment allez-vous? (How are you?) - Formal",
          "Ça va? (How's it going?) - Informal"
        ]
      },
      {
        type: 'text',
        content: "In French culture, it's common to greet people with 'la bise' (cheek kisses) in informal settings. The number of kisses varies by region, typically 2-4 times."
      },
      {
        type: 'exercise',
        content: "Which greeting is most appropriate for a formal business meeting at 10 AM?",
        options: [
          "Salut!",
          "Bonsoir!",
          "Bonjour!",
          "Coucou!"
        ],
        correctAnswer: "Bonjour!"
      }
    ]
  },
  {
    id: 2,
    title: "Café Conversations",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Cafés are central to French social life. This lesson covers essential phrases for ordering, making small talk, and enjoying the café culture in France."
      },
      {
        type: 'example',
        content: "Café Phrases",
        examples: [
          "Je voudrais un café, s'il vous plaît. (I would like a coffee, please.)",
          "Un café au lait, s'il vous plaît. (A coffee with milk, please.)",
          "L'addition, s'il vous plaît. (The bill, please.)",
          "C'est combien? (How much is it?)",
          "Je peux m'asseoir ici? (Can I sit here?)"
        ]
      },
      {
        type: 'text',
        content: "In French cafés, it's common to take your time and enjoy your drink. The phrase 'prendre un café' means more than just drinking coffee - it's a social activity."
      },
      {
        type: 'exercise',
        content: "How do you ask for the bill in a French café?",
        options: [
          "Je veux payer.",
          "L'addition, s'il vous plaît.",
          "Combien ça coûte?",
          "Je vais payer maintenant."
        ],
        correctAnswer: "L'addition, s'il vous plaît."
      }
    ]
  },
  {
    id: 3,
    title: "Shopping and Markets",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Shopping in France is a cultural experience. This lesson covers essential phrases for navigating markets, boutiques, and understanding French shopping etiquette."
      },
      {
        type: 'example',
        content: "Shopping Phrases",
        examples: [
          "Je cherche... (I'm looking for...)",
          "Combien ça coûte? (How much is it?)",
          "C'est trop cher. (It's too expensive.)",
          "Vous avez d'autres couleurs? (Do you have other colors?)",
          "Je peux essayer? (Can I try it on?)"
        ]
      },
      {
        type: 'text',
        content: "In French markets, it's common to greet vendors with 'Bonjour' before starting your transaction. Bargaining is not typical in most French shops, but markets might be more flexible."
      },
      {
        type: 'exercise',
        content: "What's the polite way to ask if you can try on clothes?",
        options: [
          "Je veux essayer ça.",
          "Je peux essayer?",
          "Donnez-moi la taille plus grande.",
          "Où sont les cabines d'essayage?"
        ],
        correctAnswer: "Je peux essayer?"
      }
    ]
  },
  {
    id: 4,
    title: "Making Plans",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Making plans in French requires understanding both the language and cultural context. This lesson covers how to suggest activities, accept or decline invitations, and arrange meetings."
      },
      {
        type: 'example',
        content: "Planning Phrases",
        examples: [
          "On se retrouve à quelle heure? (What time should we meet?)",
          "Je propose qu'on aille... (I suggest we go...)",
          "Ça te dit de...? (How about...?)",
          "Désolé, je ne peux pas. (Sorry, I can't.)",
          "Avec plaisir! (With pleasure!)"
        ]
      },
      {
        type: 'text',
        content: "French people often make plans more spontaneously than in some other cultures. It's common to make arrangements just a few hours in advance, especially for social gatherings."
      },
      {
        type: 'exercise',
        content: "How do you suggest going to a restaurant in French?",
        options: [
          "Je veux aller au restaurant.",
          "On va au restaurant?",
          "Je propose qu'on aille au restaurant.",
          "Allons au restaurant."
        ],
        correctAnswer: "Je propose qu'on aille au restaurant."
      }
    ]
  }
];

const vietnameseForEnglishContent: Lesson[] = [
  {
    id: 1,
    title: "Vietnamese Alphabet and Pronunciation",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Vietnamese uses the Latin alphabet with additional diacritical marks to indicate tones and pronunciation. There are 29 letters in the Vietnamese alphabet, and mastering the sounds is crucial for clear communication."
      },
      {
        type: 'example',
        content: "Vietnamese Alphabet",
        examples: [
          "A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y"
        ]
      },
      {
        type: 'text',
        content: "Vietnamese is a tonal language with six tones: level, rising, falling, broken, curve, and heavy. Each tone changes the meaning of a word."
      },
      {
        type: 'example',
        content: "Tones Example (ma):",
        examples: [
          "ma (ghost)",
          "má (mother)",
          "mà (but)",
          "mả (tomb)",
          "mã (horse)",
          "mạ (rice seedling)"
        ]
      },
      {
        type: 'exercise',
        content: "How many tones does Vietnamese have?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6"
      }
    ]
  },
  {
    id: 2,
    title: "Basic Greetings and Introductions",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Greetings in Vietnamese depend on the time of day and the relationship between speakers."
      },
      {
        type: 'example',
        content: "Common Greetings",
        examples: [
          "Xin chào (Hello)",
          "Chào buổi sáng (Good morning)",
          "Chào buổi tối (Good evening)",
          "Tôi tên là... (My name is...)"
        ]
      },
      {
        type: 'text',
        content: "Vietnamese uses different pronouns based on age and relationship. 'Bạn' is used for peers, while 'anh', 'chị', 'em', etc., are used for others."
      },
      {
        type: 'exercise',
        content: "How do you say 'My name is John' in Vietnamese?",
        options: [
          "Tôi là John",
          "Tên tôi là John",
          "Tôi tên là John",
          "John là tên tôi"
        ],
        correctAnswer: "Tôi tên là John"
      }
    ]
  },
  {
    id: 3,
    title: "Numbers, Dates, and Time",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Numbers in Vietnamese are straightforward. Dates are written as day/month/year. Time uses the 24-hour clock."
      },
      {
        type: 'example',
        content: "Numbers 1-10",
        examples: [
          "một (1)", "hai (2)", "ba (3)", "bốn (4)", "năm (5)", "sáu (6)", "bảy (7)", "tám (8)", "chín (9)", "mười (10)"
        ]
      },
      {
        type: 'text',
        content: "To say the time: 'giờ' means hour, 'phút' means minute. Example: 'ba giờ rưỡi' (3:30)."
      },
      {
        type: 'exercise',
        content: "How do you say '3:30' in Vietnamese?",
        options: [
          "ba giờ ba mươi",
          "ba giờ rưỡi",
          "ba giờ mười lăm",
          "ba giờ bốn mươi lăm"
        ],
        correctAnswer: "ba giờ rưỡi"
      }
    ]
  },
  {
    id: 4,
    title: "Essential Phrases for Travelers",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Knowing key phrases helps you navigate Vietnam."
      },
      {
        type: 'example',
        content: "Useful Phrases",
        examples: [
          "Tôi muốn mua... (I want to buy...)",
          "Bao nhiêu tiền? (How much is it?)",
          "Nhà vệ sinh ở đâu? (Where is the restroom?)",
          "Giúp tôi với! (Help me!)"
        ]
      },
      {
        type: 'exercise',
        content: "How do you ask 'How much is it?' in Vietnamese?",
        options: [
          "Bạn khỏe không?",
          "Bao nhiêu tiền?",
          "Cảm ơn",
          "Xin lỗi"
        ],
        correctAnswer: "Bao nhiêu tiền?"
      }
    ]
  },
  {
    id: 5,
    title: "Vietnamese Food and Culture",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Vietnamese cuisine is famous for its flavors and variety."
      },
      {
        type: 'example',
        content: "Popular Dishes",
        examples: [
          "Phở (noodle soup)",
          "Bánh mì (Vietnamese sandwich)",
          "Gỏi cuốn (spring rolls)",
          "Cơm tấm (broken rice)"
        ]
      },
      {
        type: 'text',
        content: "Food is an important part of Vietnamese culture and social life."
      },
      {
        type: 'exercise',
        content: "What is 'Phở'?",
        options: [
          "A type of bread",
          "A noodle soup",
          "A dessert",
          "A drink"
        ],
        correctAnswer: "A noodle soup"
      }
    ]
  }
];

const englishForVietnameseContent: Lesson[] = [
  {
    id: 1,
    title: "English Alphabet and Pronunciation",
    completed: false,
    content: [
      {
        type: 'text',
        content: "English uses the Latin alphabet with 26 letters. Some sounds in English do not exist in Vietnamese, such as the 'th' sound."
      },
      {
        type: 'example',
        content: "Difficult Sounds for Vietnamese Speakers",
        examples: [
          "th (think, this)",
          "r (red, right)",
          "vowel pairs (ship/sheep, full/fool)"
        ]
      },
      {
        type: 'exercise',
        content: "Which word contains the 'th' sound?",
        options: ["think", "sink", "zinc", "link"],
        correctAnswer: "think"
      }
    ]
  },
  {
    id: 2,
    title: "Basic English Grammar",
    completed: false,
    content: [
      {
        type: 'text',
        content: "English sentences follow the Subject-Verb-Object order. Articles (a, an, the) are used before nouns."
      },
      {
        type: 'example',
        content: "Examples of Articles",
        examples: [
          "a cat, an apple, the book"
        ]
      },
      {
        type: 'exercise',
        content: "Which sentence is correct?",
        options: [
          "I go to school",
          "I going to school",
          "I goes to school",
          "I to go school"
        ],
        correctAnswer: "I go to school"
      }
    ]
  },
  {
    id: 3,
    title: "Common English Phrases",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Learning common phrases helps you communicate in daily life."
      },
      {
        type: 'example',
        content: "Useful Phrases",
        examples: [
          "How are you?",
          "Nice to meet you",
          "Thank you very much",
          "Could you repeat that?"
        ]
      },
      {
        type: 'exercise',
        content: "How do you say 'Thank you very much' in English?",
        options: [
          "Cảm ơn rất nhiều",
          "Thank you very much",
          "Xin chào",
          "Goodbye"
        ],
        correctAnswer: "Thank you very much"
      }
    ]
  },
  {
    id: 4,
    title: "Numbers, Dates, and Time in English",
    completed: false,
    content: [
      {
        type: 'text',
        content: "Numbers in English are used for counting, dates, and telling time. Dates are written as month/day/year in American English."
      },
      {
        type: 'example',
        content: "Numbers 1-10",
        examples: [
          "one (1)", "two (2)", "three (3)", "four (4)", "five (5)", "six (6)", "seven (7)", "eight (8)", "nine (9)", "ten (10)"
        ]
      },
      {
        type: 'exercise',
        content: "How do you say '3:30' in English?",
        options: [
          "three thirty",
          "thirty three",
          "three and a half",
          "half past three"
        ],
        correctAnswer: "three thirty"
      }
    ]
  },
  {
    id: 5,
    title: "English for Travel and Shopping",
    completed: false,
    content: [
      {
        type: 'text',
        content: "When traveling or shopping, these phrases are useful."
      },
      {
        type: 'example',
        content: "Travel and Shopping Phrases",
        examples: [
          "How much is this?",
          "Where is the restroom?",
          "I would like to buy...",
          "Can you help me?"
        ]
      },
      {
        type: 'exercise',
        content: "How do you ask 'Where is the restroom?' in English?",
        options: [
          "Nhà vệ sinh ở đâu?",
          "Where is the restroom?",
          "How much is this?",
          "I want to buy this"
        ],
        correctAnswer: "Where is the restroom?"
      }
    ]
  }
];

const CourseContent: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const { publicKey } = useWallet();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const getCourseContent = () => {
    switch (Number(courseId)) {
      case 1: // Spanish course
        return spanishCourseContent;
      case 2: // Business English
        return businessEnglishContent;
      case 3: // Japanese Kanji
        return japaneseKanjiContent;
      case 4: // French Conversation
        return frenchConversationContent;
      case 5: // Vietnamese for English speakers
        return vietnameseForEnglishContent;
      case 6: // English for Vietnamese speakers
        return englishForVietnameseContent;
      default:
        return spanishCourseContent; // Default to Spanish for now
    }
  };

  const currentLessonData = getCourseContent()[currentLessonIndex];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setIsCorrect(answer === currentLessonData.content[currentLessonIndex].correctAnswer);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < getCourseContent().length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
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
            Back to Course Details
          </CustomButton>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-purple-800">{currentLessonData.title}</h1>
              <span className="text-sm text-gray-500">Lesson {currentLessonIndex + 1} of {getCourseContent().length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLessonIndex + 1) / getCourseContent().length) * 100}%` }}
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
                            showAnswer
                              ? option === item.correctAnswer
                                ? 'bg-green-100 text-green-800'
                                : selectedAnswer === option
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          disabled={showAnswer}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {showAnswer && (
                      <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg">
                        {isCorrect
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
              disabled={currentLessonIndex === 0}
            >
              Previous Lesson
            </CustomButton>
            <CustomButton
              variant="gradient-blue"
              onClick={handleNextLesson}
              disabled={currentLessonIndex === getCourseContent().length - 1}
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