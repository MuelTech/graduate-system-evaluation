import type { AdminOption, ExamOption, ExamQuestion, ExamQuestionType, ExamStimulusType, StructuredStimulus } from "@/types";
import type { StructuredStimulusEmphasis, TextEmphasisSpan } from "@/lib/text-emphasis";

export interface EvaluationMcqQuestion extends ExamQuestion {
  questionNumber: number;
  correctAnswer: string;
  correctOptionId: string;
  options: (ExamOption & { isCorrect: boolean })[];
}

export const EXAM_MEDIA_ASSET_MAP: Record<string, string> = {
  "f4fd43a3-2547-4cd2-8559-76308b29537c": "/exam-assets/q004/stimulus.png",
  "2add9be6-1fe6-4cfe-825b-5126526bacfd": "/exam-assets/q004/option_F.png",
  "bf30d896-d58c-4a61-857d-2ef40935a17d": "/exam-assets/q004/option_G.png",
  "785232bf-e191-486b-8410-d21239452bb2": "/exam-assets/q004/option_H.png",
  "9cf950fb-6f38-48a3-8d42-4032bbad406e": "/exam-assets/q004/option_J.png",
  "50215e3b-9040-4229-8b4a-08342a9a82bd": "/exam-assets/q004/option_K.png",
  "1772125d-e006-4a1e-8fc1-b63980968195": "/exam-assets/q008/stimulus.png",
  "bedaab38-da37-4f9c-89da-125ee794f33e": "/exam-assets/q008/option_F.png",
  "cd71dd88-d91f-4268-8885-47a0a123590e": "/exam-assets/q008/option_G.png",
  "da384f6c-46ab-4158-8374-8b8a91451218": "/exam-assets/q008/option_H.png",
  "6f9ea87d-4a85-4b86-8fa8-c49b7ed289de": "/exam-assets/q008/option_J.png",
  "7b12f921-05ed-4309-8f25-94ba7c534055": "/exam-assets/q008/option_K.png",
  "41b14832-1d0e-4318-84fb-e29f828f7219": "/exam-assets/q012/stimulus.png",
  "6e2a3d5f-bf8a-483b-80f3-da5703ae83a7": "/exam-assets/q012/option_F.png",
  "d26ffc14-d63d-449a-8517-a5513312619c": "/exam-assets/q012/option_G.png",
  "266cce60-6ad1-4bde-8f37-424ea4dfc175": "/exam-assets/q012/option_H.png",
  "cd777824-9feb-45bf-8914-9bdf3f57df0d": "/exam-assets/q012/option_J.png",
  "677afb6a-16ef-48f9-8d52-7d7ecf09a0c4": "/exam-assets/q012/option_K.png",
  "00777dd2-bc65-4027-8ce3-7578f5f67289": "/exam-assets/q019/stimulus.png",
  "b120eeb5-b7ae-4905-840e-a025cbc29e22": "/exam-assets/q019/option_A.png",
  "b1861996-ee21-44c4-855b-3cce3fc8f470": "/exam-assets/q019/option_B.png",
  "bad5219f-f49f-4c47-8be1-9f5d07eab404": "/exam-assets/q019/option_C.png",
  "d2ef16b8-0121-40d8-8bb4-dbfbb5a23561": "/exam-assets/q019/option_D.png",
  "3d82e055-9d71-4587-8d7a-0953439f73a0": "/exam-assets/q019/option_E.png",
  "8594e104-decb-43e2-871e-32d7ce56ba41": "/exam-assets/q022/stimulus.png",
  "ca7bed81-47eb-4fd1-8541-33d1f032afad": "/exam-assets/q022/option_F.png",
  "382bd5c0-7584-4b76-8f61-75532a29bc47": "/exam-assets/q022/option_G.png",
  "4665aa66-8a8c-42a0-8d4d-373ac6129b03": "/exam-assets/q022/option_H.png",
  "d9519a91-c7b8-4f58-8c2b-64f39335d209": "/exam-assets/q022/option_J.png",
  "ea87b37a-6180-485e-8981-5066c6e1be03": "/exam-assets/q022/option_K.png",
  "0ba66902-7083-4af5-80d8-a2febc4eef78": "/exam-assets/q029/stimulus.png",
  "9b7d1acf-2dbc-433b-8e28-a72613b5057b": "/exam-assets/q029/option_A.png",
  "3d0dcb0a-96f6-4e12-8e5a-e0b4f6a43e10": "/exam-assets/q029/option_B.png",
  "0bbeb014-5148-407a-8d89-f8e6dbe01e2c": "/exam-assets/q029/option_C.png",
  "9c3a9b6c-37ee-43be-8705-4e8929c98e6f": "/exam-assets/q029/option_D.png",
  "8339d2a7-785a-453b-89ec-bc10e1843500": "/exam-assets/q029/option_E.png",
  "fc7e02d0-bc42-48c7-8220-7dabae5cddbb": "/exam-assets/q031/stimulus.png",
  "f5eb52c0-e300-4c60-8c9f-8682d9604a55": "/exam-assets/q031/option_A.png",
  "c59c2d21-43a7-42cc-84d1-cc2096c4aa59": "/exam-assets/q031/option_B.png",
  "8095dad8-9239-4974-80ab-c390b3141950": "/exam-assets/q031/option_C.png",
  "8f74316b-79ae-4470-838d-d188e9024625": "/exam-assets/q031/option_D.png",
  "69081231-0a32-4f1b-8774-2dbc0c5f3177": "/exam-assets/q031/option_E.png",
  "5569d800-3ced-4ada-8aa8-e5d9f4d40354": "/exam-assets/q032/stimulus.png",
  "a976c583-ccef-4723-8a16-0dcb2b593a3b": "/exam-assets/q032/option_F.png",
  "ef063ba7-605e-4bff-822a-3e470fc058ad": "/exam-assets/q032/option_G.png",
  "8420ca55-16e3-4354-8574-c47159d151c7": "/exam-assets/q032/option_H.png",
  "5baba26e-23e5-4d55-82f4-1a4e77245b77": "/exam-assets/q032/option_J.png",
  "cb4d1e6d-09ed-4eea-82c3-0742314f4cbe": "/exam-assets/q032/option_K.png",
  "3a063b12-59d8-4b3d-8b89-13744b1adcb9": "/exam-assets/q041/stimulus.png",
  "1c9141d8-27c7-4ff7-89e1-de3a0781ca26": "/exam-assets/q041/option_A.png",
  "e59a7d53-d006-48a0-8c0c-884b75acf2de": "/exam-assets/q041/option_B.png",
  "127948eb-169c-45c9-8742-e9a734f8099c": "/exam-assets/q041/option_C.png",
  "461b691c-7b18-4635-8d61-426103b5dc91": "/exam-assets/q041/option_D.png",
  "5b8c0936-14ca-45e7-869d-b03966d3ae23": "/exam-assets/q041/option_E.png",
  "6d042f3a-83c1-435b-8540-490898176799": "/exam-assets/q043/stimulus.png",
  "b13de97a-03e3-49de-82b1-74f0742695a4": "/exam-assets/q043/option_A.png",
  "89cacf66-3c9a-4723-8ca6-29aea66ef0b4": "/exam-assets/q043/option_B.png",
  "bf4a7c89-9483-40f9-8f50-7f71542810fb": "/exam-assets/q043/option_C.png",
  "3f86fdf9-f8fb-404c-82d0-4fa2241d33c6": "/exam-assets/q043/option_D.png",
  "5c1ed039-e99f-456b-8516-180be2560ea9": "/exam-assets/q043/option_E.png",
  "4472da84-e9c7-4c98-8f3d-26191e5ecca4": "/exam-assets/q048/stimulus.png",
  "88754f13-b330-4f74-81b7-d722d5fb6d33": "/exam-assets/q048/option_F.png",
  "1bfff723-11ae-4052-8c08-7cddce7ace10": "/exam-assets/q048/option_G.png",
  "bd2282e2-e677-432d-8ad0-f8cc34acaec2": "/exam-assets/q048/option_H.png",
  "35b830ee-9244-42cf-8b8c-d76a6658fdec": "/exam-assets/q048/option_J.png",
  "fb6dabf7-fc23-4add-88f3-a7ec493144a2": "/exam-assets/q048/option_K.png",
  "e6acea32-ed55-4a6c-864b-1ee4c015d29e": "/exam-assets/q054/stimulus.png",
  "c8b7ca72-8d0f-4ae5-8e24-5220402e2de3": "/exam-assets/q054/option_F.png",
  "e4d6e8e2-93c0-4b3f-8dfe-1c4e3cb67685": "/exam-assets/q054/option_G.png",
  "8c5c4d5e-8428-41e8-817b-62cb740f9fd6": "/exam-assets/q054/option_H.png",
  "754a11a3-8588-48ec-8453-79c8047cdd11": "/exam-assets/q054/option_J.png",
  "a3ca272a-971a-4c74-8fab-7174cc3dcbf1": "/exam-assets/q054/option_K.png",
  "34c4a1b5-3dd9-416d-84e7-096b40d702e9": "/exam-assets/q056/stimulus.png",
  "877ec8d8-ddb7-4375-8772-2ce9bef2bcef": "/exam-assets/q056/option_F.png",
  "2d201c51-09f0-4a83-8192-8b38a470780b": "/exam-assets/q056/option_G.png",
  "7e89c060-f699-4916-81f4-a0557910d1f2": "/exam-assets/q056/option_H.png",
  "9201354d-9b4d-4d55-861f-9b6986172a86": "/exam-assets/q056/option_J.png",
  "463b82ab-c623-442a-8d69-5880f23c83db": "/exam-assets/q056/option_K.png",
  "e416bfc8-6099-40b6-8373-df3074c2a1a3": "/exam-assets/q059/stimulus.png",
  "771ab466-ba24-4425-8a77-51f67f6b58b6": "/exam-assets/q059/option_A.png",
  "bf0f1738-4680-4129-81ca-28c59ff9eca6": "/exam-assets/q059/option_B.png",
  "4a26536a-9540-4ec6-8c5e-7ad2df151427": "/exam-assets/q059/option_C.png",
  "c1d6e03e-4537-4af7-8b5e-a89e3ae30cd5": "/exam-assets/q059/option_D.png",
  "9bfee0db-6398-43bb-8d8a-c04b9887dfb6": "/exam-assets/q059/option_E.png",
  "869a9854-bb11-44d3-80e4-241cd05316ff": "/exam-assets/q063/stimulus.png",
  "b4057edb-e78d-4e6a-8c5d-0f99d1fea8d5": "/exam-assets/q063/option_A.png",
  "4ddc07f5-ce0c-41d4-8297-fd453644b471": "/exam-assets/q063/option_B.png",
  "40251138-7cd4-405c-83ab-5d417f940135": "/exam-assets/q063/option_C.png",
  "50ded124-e8fd-43b7-87f9-7c5d5d9a4f2f": "/exam-assets/q063/option_D.png",
  "ac53c4d1-70cf-4c16-803c-2b089d7f5e80": "/exam-assets/q063/option_E.png",
  "45ce126e-960f-4d2f-8d18-00a12710b143": "/exam-assets/q066/stimulus.png",
  "4460fd70-7204-4938-8bb3-5d7b6b2d08b3": "/exam-assets/q066/option_F.png",
  "c2ccfb4d-0a51-4972-8672-9ef1ff6e0d2b": "/exam-assets/q066/option_G.png",
  "96799d28-8178-4687-8079-c66e4e4299ee": "/exam-assets/q066/option_H.png",
  "651f2264-8361-4f78-810d-e86881e64fe1": "/exam-assets/q066/option_J.png",
  "f479bd84-3654-4ded-812e-3b4cb1d9406a": "/exam-assets/q066/option_K.png",
  "e68b0fc9-800d-4156-890b-1fff4f4062ca": "/exam-assets/q068/stimulus.png",
  "805ecf72-4884-4144-813b-91d5b493f22c": "/exam-assets/q068/option_F.png",
  "29817d4c-492b-4428-8ae7-ff4c8eac746b": "/exam-assets/q068/option_G.png",
  "f3f933c1-c885-43f9-816e-85105de9395e": "/exam-assets/q068/option_H.png",
  "f07a2554-cf72-43d5-8548-0266e03cdaf0": "/exam-assets/q068/option_J.png",
  "8c61dd90-117b-40b0-89cd-914ea85e0e3f": "/exam-assets/q068/option_K.png",
  "1c9a777a-1971-460f-8797-026be3b965a3": "/exam-assets/q070/stimulus.png",
  "0ccabffe-ea92-4449-8006-9d96122029ec": "/exam-assets/q070/option_F.png",
  "031ff28b-e221-4bc0-8b8e-85d9da8f8266": "/exam-assets/q070/option_G.png",
  "cdbc4ed5-0e96-4c03-8529-433f004da26e": "/exam-assets/q070/option_H.png",
  "ab0cdb3e-2042-42c9-88d3-a8c53cc1fd57": "/exam-assets/q070/option_J.png",
  "b97578ae-488d-4daa-83e3-583c0c9edb75": "/exam-assets/q070/option_K.png"
};

export const APPLICANT_EXAM_MCQ_QUESTIONS: EvaluationMcqQuestion[] = [
  {
    "id": "olsat-q-001",
    "questionNumber": 1,
    "questionText": "Choose the words that best complete this sentence: _____ I was nervous, I had a _____ manner.",
    "questionTextEmphasis": [
      {
        "start": 22,
        "end": 26,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 1,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "A",
    "correctOptionId": "olsat-q-001-opt-A",
    "options": [
      {
        "id": "olsat-q-001-opt-A",
        "questionId": "olsat-q-001",
        "label": "A",
        "order": 0,
        "optionText": "When — sad",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-001-opt-B",
        "questionId": "olsat-q-001",
        "label": "B",
        "order": 1,
        "optionText": "After — jittery",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-001-opt-C",
        "questionId": "olsat-q-001",
        "label": "C",
        "order": 2,
        "optionText": "If — reasonable",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-001-opt-D",
        "questionId": "olsat-q-001",
        "label": "D",
        "order": 3,
        "optionText": "Although — quiet",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-001-opt-E",
        "questionId": "olsat-q-001",
        "label": "E",
        "order": 4,
        "optionText": "Where — humorous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-002",
    "questionNumber": 2,
    "questionText": "The words in the box go together in a certain way. Choose the word that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 2,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          "ail",
          "rail",
          "trail"
        ],
        [
          "ate",
          "?",
          "slate"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "K",
    "correctOptionId": "olsat-q-002-opt-K",
    "options": [
      {
        "id": "olsat-q-002-opt-F",
        "questionId": "olsat-q-002",
        "label": "F",
        "order": 0,
        "optionText": "seat",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-002-opt-G",
        "questionId": "olsat-q-002",
        "label": "G",
        "order": 1,
        "optionText": "rate",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-002-opt-H",
        "questionId": "olsat-q-002",
        "label": "H",
        "order": 2,
        "optionText": "tail",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-002-opt-J",
        "questionId": "olsat-q-002",
        "label": "J",
        "order": 3,
        "optionText": "slat",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-002-opt-K",
        "questionId": "olsat-q-002",
        "label": "K",
        "order": 4,
        "optionText": "late",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-003",
    "questionNumber": 3,
    "questionText": "The numbers in the box go together in a certain way. Choose the number that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 3,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          3,
          9,
          27
        ],
        [
          1,
          3,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-003-opt-D",
    "options": [
      {
        "id": "olsat-q-003-opt-A",
        "questionId": "olsat-q-003",
        "label": "A",
        "order": 0,
        "optionText": "4",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-003-opt-B",
        "questionId": "olsat-q-003",
        "label": "B",
        "order": 1,
        "optionText": "5",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-003-opt-C",
        "questionId": "olsat-q-003",
        "label": "C",
        "order": 2,
        "optionText": "7",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-003-opt-D",
        "questionId": "olsat-q-003",
        "label": "D",
        "order": 3,
        "optionText": "9",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-003-opt-E",
        "questionId": "olsat-q-003",
        "label": "E",
        "order": 4,
        "optionText": "30",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-004",
    "questionNumber": 4,
    "questionText": "is to ... as ... is to —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 4,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "f4fd43a3-2547-4cd2-8559-76308b29537c",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-004-opt-H",
    "options": [
      {
        "id": "olsat-q-004-opt-F",
        "questionId": "olsat-q-004",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "2add9be6-1fe6-4cfe-825b-5126526bacfd",
        "isCorrect": false
      },
      {
        "id": "olsat-q-004-opt-G",
        "questionId": "olsat-q-004",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "bf30d896-d58c-4a61-857d-2ef40935a17d",
        "isCorrect": false
      },
      {
        "id": "olsat-q-004-opt-H",
        "questionId": "olsat-q-004",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "785232bf-e191-486b-8410-d21239452bb2",
        "isCorrect": true
      },
      {
        "id": "olsat-q-004-opt-J",
        "questionId": "olsat-q-004",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "9cf950fb-6f38-48a3-8d42-4032bbad406e",
        "isCorrect": false
      },
      {
        "id": "olsat-q-004-opt-K",
        "questionId": "olsat-q-004",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "50215e3b-9040-4229-8b4a-08342a9a82bd",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-005",
    "questionNumber": 5,
    "questionText": "First is to original as only is to —",
    "questionTextEmphasis": [
      {
        "start": 0,
        "end": 5,
        "style": "BOLD"
      },
      {
        "start": 12,
        "end": 20,
        "style": "BOLD"
      },
      {
        "start": 24,
        "end": 28,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 5,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "A",
    "correctOptionId": "olsat-q-005-opt-A",
    "options": [
      {
        "id": "olsat-q-005-opt-A",
        "questionId": "olsat-q-005",
        "label": "A",
        "order": 0,
        "optionText": "special",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-005-opt-B",
        "questionId": "olsat-q-005",
        "label": "B",
        "order": 1,
        "optionText": "unique",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-005-opt-C",
        "questionId": "olsat-q-005",
        "label": "C",
        "order": 2,
        "optionText": "expensive",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-005-opt-D",
        "questionId": "olsat-q-005",
        "label": "D",
        "order": 3,
        "optionText": "many",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-005-opt-E",
        "questionId": "olsat-q-005",
        "label": "E",
        "order": 4,
        "optionText": "last",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-006",
    "questionNumber": 6,
    "questionText": "If the words below were arranged to make the best sentence, with which letter would the first word of the sentence begin?",
    "questionTextEmphasis": [
      {
        "start": 45,
        "end": 49,
        "style": "ITALIC"
      },
      {
        "start": 88,
        "end": 93,
        "style": "UNDERLINE"
      },
      {
        "start": 115,
        "end": 120,
        "style": "UNDERLINE"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 6,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "WORD_BANK",
      "items": [
        "way",
        "help",
        "the",
        "find",
        "me"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-006-opt-H",
    "options": [
      {
        "id": "olsat-q-006-opt-F",
        "questionId": "olsat-q-006",
        "label": "F",
        "order": 0,
        "optionText": "F",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-006-opt-G",
        "questionId": "olsat-q-006",
        "label": "G",
        "order": 1,
        "optionText": "W",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-006-opt-H",
        "questionId": "olsat-q-006",
        "label": "H",
        "order": 2,
        "optionText": "H",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-006-opt-J",
        "questionId": "olsat-q-006",
        "label": "J",
        "order": 3,
        "optionText": "T",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-006-opt-K",
        "questionId": "olsat-q-006",
        "label": "K",
        "order": 4,
        "optionText": "M",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-007",
    "questionNumber": 7,
    "questionText": "The numbers in each box go together by following the same rule. Decide what the rule is, and then choose the number that goes where you see the question mark.",
    "questionTextEmphasis": [
      {
        "start": 53,
        "end": 57,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 7,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          5,
          8,
          16
        ],
        [
          7,
          10,
          20
        ],
        [
          9,
          12,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-007-opt-E",
    "options": [
      {
        "id": "olsat-q-007-opt-A",
        "questionId": "olsat-q-007",
        "label": "A",
        "order": 0,
        "optionText": "18",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-007-opt-B",
        "questionId": "olsat-q-007",
        "label": "B",
        "order": 1,
        "optionText": "20",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-007-opt-C",
        "questionId": "olsat-q-007",
        "label": "C",
        "order": 2,
        "optionText": "21",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-007-opt-D",
        "questionId": "olsat-q-007",
        "label": "D",
        "order": 3,
        "optionText": "22",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-007-opt-E",
        "questionId": "olsat-q-007",
        "label": "E",
        "order": 4,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-008",
    "questionNumber": 8,
    "questionText": "The drawings in the first part of the row go together to form a series. In the next part of the row, choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 8,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "1772125d-e006-4a1e-8fc1-b63980968195",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-008-opt-H",
    "options": [
      {
        "id": "olsat-q-008-opt-F",
        "questionId": "olsat-q-008",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "bedaab38-da37-4f9c-89da-125ee794f33e",
        "isCorrect": false
      },
      {
        "id": "olsat-q-008-opt-G",
        "questionId": "olsat-q-008",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "cd71dd88-d91f-4268-8885-47a0a123590e",
        "isCorrect": false
      },
      {
        "id": "olsat-q-008-opt-H",
        "questionId": "olsat-q-008",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "da384f6c-46ab-4158-8374-8b8a91451218",
        "isCorrect": true
      },
      {
        "id": "olsat-q-008-opt-J",
        "questionId": "olsat-q-008",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "6f9ea87d-4a85-4b86-8fa8-c49b7ed289de",
        "isCorrect": false
      },
      {
        "id": "olsat-q-008-opt-K",
        "questionId": "olsat-q-008",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "7b12f921-05ed-4309-8f25-94ba7c534055",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-009",
    "questionNumber": 9,
    "questionText": "What number comes next in this series?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 9,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "NUMBER_SEQUENCE",
      "items": [
        1,
        6,
        10,
        13,
        15,
        "?"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "B",
    "correctOptionId": "olsat-q-009-opt-B",
    "options": [
      {
        "id": "olsat-q-009-opt-A",
        "questionId": "olsat-q-009",
        "label": "A",
        "order": 0,
        "optionText": "14",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-009-opt-B",
        "questionId": "olsat-q-009",
        "label": "B",
        "order": 1,
        "optionText": "16",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-009-opt-C",
        "questionId": "olsat-q-009",
        "label": "C",
        "order": 2,
        "optionText": "17",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-009-opt-D",
        "questionId": "olsat-q-009",
        "label": "D",
        "order": 3,
        "optionText": "18",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-009-opt-E",
        "questionId": "olsat-q-009",
        "label": "E",
        "order": 4,
        "optionText": "19",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-010",
    "questionNumber": 10,
    "questionText": "The opposite of confinement is —",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 27,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 10,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "K",
    "correctOptionId": "olsat-q-010-opt-K",
    "options": [
      {
        "id": "olsat-q-010-opt-F",
        "questionId": "olsat-q-010",
        "label": "F",
        "order": 0,
        "optionText": "recognition",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-010-opt-G",
        "questionId": "olsat-q-010",
        "label": "G",
        "order": 1,
        "optionText": "satisfaction",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-010-opt-H",
        "questionId": "olsat-q-010",
        "label": "H",
        "order": 2,
        "optionText": "cooperation",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-010-opt-J",
        "questionId": "olsat-q-010",
        "label": "J",
        "order": 3,
        "optionText": "dedication",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-010-opt-K",
        "questionId": "olsat-q-010",
        "label": "K",
        "order": 4,
        "optionText": "freedom",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-011",
    "questionNumber": 11,
    "questionText": "Which word does not go with the other four?",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 19,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 11,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "B",
    "correctOptionId": "olsat-q-011-opt-B",
    "options": [
      {
        "id": "olsat-q-011-opt-A",
        "questionId": "olsat-q-011",
        "label": "A",
        "order": 0,
        "optionText": "honest",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-011-opt-B",
        "questionId": "olsat-q-011",
        "label": "B",
        "order": 1,
        "optionText": "polite",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-011-opt-C",
        "questionId": "olsat-q-011",
        "label": "C",
        "order": 2,
        "optionText": "truthful",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-011-opt-D",
        "questionId": "olsat-q-011",
        "label": "D",
        "order": 3,
        "optionText": "open",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-011-opt-E",
        "questionId": "olsat-q-011",
        "label": "E",
        "order": 4,
        "optionText": "frank",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-012",
    "questionNumber": 12,
    "questionText": "The drawings in the box go together in a certain way. Choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 12,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "41b14832-1d0e-4318-84fb-e29f828f7219",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-012-opt-J",
    "options": [
      {
        "id": "olsat-q-012-opt-F",
        "questionId": "olsat-q-012",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "6e2a3d5f-bf8a-483b-80f3-da5703ae83a7",
        "isCorrect": false
      },
      {
        "id": "olsat-q-012-opt-G",
        "questionId": "olsat-q-012",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "d26ffc14-d63d-449a-8517-a5513312619c",
        "isCorrect": false
      },
      {
        "id": "olsat-q-012-opt-H",
        "questionId": "olsat-q-012",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "266cce60-6ad1-4bde-8f37-424ea4dfc175",
        "isCorrect": false
      },
      {
        "id": "olsat-q-012-opt-J",
        "questionId": "olsat-q-012",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "cd777824-9feb-45bf-8914-9bdf3f57df0d",
        "isCorrect": true
      },
      {
        "id": "olsat-q-012-opt-K",
        "questionId": "olsat-q-012",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "677afb6a-16ef-48f9-8d52-7d7ecf09a0c4",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-013",
    "questionNumber": 13,
    "questionText": "There are five houses in a row. One house is green. Two yellow houses are next to each other. The end house is red. The middle house is blue. What colors are the houses that are farthest apart?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 13,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "A",
    "correctOptionId": "olsat-q-013-opt-A",
    "options": [
      {
        "id": "olsat-q-013-opt-A",
        "questionId": "olsat-q-013",
        "label": "A",
        "order": 0,
        "optionText": "Red and yellow",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-013-opt-B",
        "questionId": "olsat-q-013",
        "label": "B",
        "order": 1,
        "optionText": "Red and blue",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-013-opt-C",
        "questionId": "olsat-q-013",
        "label": "C",
        "order": 2,
        "optionText": "Yellow and blue",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-013-opt-D",
        "questionId": "olsat-q-013",
        "label": "D",
        "order": 3,
        "optionText": "Green and yellow",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-013-opt-E",
        "questionId": "olsat-q-013",
        "label": "E",
        "order": 4,
        "optionText": "Blue and green",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-014",
    "questionNumber": 14,
    "questionText": "An enclosure always has —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 14,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-014-opt-F",
    "options": [
      {
        "id": "olsat-q-014-opt-F",
        "questionId": "olsat-q-014",
        "label": "F",
        "order": 0,
        "optionText": "an entrance",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-014-opt-G",
        "questionId": "olsat-q-014",
        "label": "G",
        "order": 1,
        "optionText": "ventilation",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-014-opt-H",
        "questionId": "olsat-q-014",
        "label": "H",
        "order": 2,
        "optionText": "sides",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-014-opt-J",
        "questionId": "olsat-q-014",
        "label": "J",
        "order": 3,
        "optionText": "a roof",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-014-opt-K",
        "questionId": "olsat-q-014",
        "label": "K",
        "order": 4,
        "optionText": "windows",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-015",
    "questionNumber": 15,
    "questionText": "Choose the word that best completes this sentence: Faulty reasoning generally results in ______ conclusions.",
    "questionTextEmphasis": [
      {
        "start": 21,
        "end": 25,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 15,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-015-opt-D",
    "options": [
      {
        "id": "olsat-q-015-opt-A",
        "questionId": "olsat-q-015",
        "label": "A",
        "order": 0,
        "optionText": "intelligent",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-015-opt-B",
        "questionId": "olsat-q-015",
        "label": "B",
        "order": 1,
        "optionText": "valid",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-015-opt-C",
        "questionId": "olsat-q-015",
        "label": "C",
        "order": 2,
        "optionText": "eccentric",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-015-opt-D",
        "questionId": "olsat-q-015",
        "label": "D",
        "order": 3,
        "optionText": "erroneous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-015-opt-E",
        "questionId": "olsat-q-015",
        "label": "E",
        "order": 4,
        "optionText": "offensive",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-016",
    "questionNumber": 16,
    "questionText": "One number in this series is wrong. What should that number be?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 16,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "NUMBER_SEQUENCE",
      "items": [
        "1/4",
        1,
        4,
        16,
        62,
        256
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-016-opt-J",
    "options": [
      {
        "id": "olsat-q-016-opt-F",
        "questionId": "olsat-q-016",
        "label": "F",
        "order": 0,
        "optionText": "2",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-016-opt-G",
        "questionId": "olsat-q-016",
        "label": "G",
        "order": 1,
        "optionText": "6",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-016-opt-H",
        "questionId": "olsat-q-016",
        "label": "H",
        "order": 2,
        "optionText": "14",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-016-opt-J",
        "questionId": "olsat-q-016",
        "label": "J",
        "order": 3,
        "optionText": "64",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-016-opt-K",
        "questionId": "olsat-q-016",
        "label": "K",
        "order": 4,
        "optionText": "1025",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-017",
    "questionNumber": 17,
    "questionText": "The numbers in the box go together in a certain way. Choose the number that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 17,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          1,
          4,
          9
        ],
        [
          4,
          7,
          12
        ],
        [
          9,
          12,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "C",
    "correctOptionId": "olsat-q-017-opt-C",
    "options": [
      {
        "id": "olsat-q-017-opt-A",
        "questionId": "olsat-q-017",
        "label": "A",
        "order": 0,
        "optionText": "14",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-017-opt-B",
        "questionId": "olsat-q-017",
        "label": "B",
        "order": 1,
        "optionText": "15",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-017-opt-C",
        "questionId": "olsat-q-017",
        "label": "C",
        "order": 2,
        "optionText": "17",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-017-opt-D",
        "questionId": "olsat-q-017",
        "label": "D",
        "order": 3,
        "optionText": "21",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-017-opt-E",
        "questionId": "olsat-q-017",
        "label": "E",
        "order": 4,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-018",
    "questionNumber": 18,
    "questionText": "If the words below were arranged to make the best sentence, with which letter would the last word of the sentence begin?",
    "questionTextEmphasis": [
      {
        "start": 45,
        "end": 49,
        "style": "ITALIC"
      },
      {
        "start": 88,
        "end": 92,
        "style": "UNDERLINE"
      },
      {
        "start": 114,
        "end": 119,
        "style": "UNDERLINE"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 18,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "WORD_BANK",
      "items": [
        "left",
        "new",
        "was",
        "bike",
        "his",
        "outside"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "G",
    "correctOptionId": "olsat-q-018-opt-G",
    "options": [
      {
        "id": "olsat-q-018-opt-F",
        "questionId": "olsat-q-018",
        "label": "F",
        "order": 0,
        "optionText": "b",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-018-opt-G",
        "questionId": "olsat-q-018",
        "label": "G",
        "order": 1,
        "optionText": "o",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-018-opt-H",
        "questionId": "olsat-q-018",
        "label": "H",
        "order": 2,
        "optionText": "h",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-018-opt-J",
        "questionId": "olsat-q-018",
        "label": "J",
        "order": 3,
        "optionText": "w",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-018-opt-K",
        "questionId": "olsat-q-018",
        "label": "K",
        "order": 4,
        "optionText": "n",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-019",
    "questionNumber": 19,
    "questionText": "The drawings in the box go together in a certain way. Choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 19,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "00777dd2-bc65-4027-8ce3-7578f5f67289",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "C",
    "correctOptionId": "olsat-q-019-opt-C",
    "options": [
      {
        "id": "olsat-q-019-opt-A",
        "questionId": "olsat-q-019",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "b120eeb5-b7ae-4905-840e-a025cbc29e22",
        "isCorrect": false
      },
      {
        "id": "olsat-q-019-opt-B",
        "questionId": "olsat-q-019",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "b1861996-ee21-44c4-855b-3cce3fc8f470",
        "isCorrect": false
      },
      {
        "id": "olsat-q-019-opt-C",
        "questionId": "olsat-q-019",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "bad5219f-f49f-4c47-8be1-9f5d07eab404",
        "isCorrect": true
      },
      {
        "id": "olsat-q-019-opt-D",
        "questionId": "olsat-q-019",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "d2ef16b8-0121-40d8-8bb4-dbfbb5a23561",
        "isCorrect": false
      },
      {
        "id": "olsat-q-019-opt-E",
        "questionId": "olsat-q-019",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "3d82e055-9d71-4587-8d7a-0953439f73a0",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-020",
    "questionNumber": 20,
    "questionText": "Increase is to reveal as decrease is to —",
    "questionTextEmphasis": [
      {
        "start": 0,
        "end": 8,
        "style": "BOLD"
      },
      {
        "start": 15,
        "end": 21,
        "style": "BOLD"
      },
      {
        "start": 25,
        "end": 33,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 20,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-020-opt-J",
    "options": [
      {
        "id": "olsat-q-020-opt-F",
        "questionId": "olsat-q-020",
        "label": "F",
        "order": 0,
        "optionText": "reduce",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-020-opt-G",
        "questionId": "olsat-q-020",
        "label": "G",
        "order": 1,
        "optionText": "concede",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-020-opt-H",
        "questionId": "olsat-q-020",
        "label": "H",
        "order": 2,
        "optionText": "refuse",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-020-opt-J",
        "questionId": "olsat-q-020",
        "label": "J",
        "order": 3,
        "optionText": "conceal",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-020-opt-K",
        "questionId": "olsat-q-020",
        "label": "K",
        "order": 4,
        "optionText": "disclose",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-021",
    "questionNumber": 21,
    "questionText": "Robert buys 14 cans of dog food every week for his dogs, who each eat one can a day. If Robert has twice as many cats as dogs, how many cats does he have?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 21,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "B",
    "correctOptionId": "olsat-q-021-opt-B",
    "options": [
      {
        "id": "olsat-q-021-opt-A",
        "questionId": "olsat-q-021",
        "label": "A",
        "order": 0,
        "optionText": "2",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-021-opt-B",
        "questionId": "olsat-q-021",
        "label": "B",
        "order": 1,
        "optionText": "4",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-021-opt-C",
        "questionId": "olsat-q-021",
        "label": "C",
        "order": 2,
        "optionText": "6",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-021-opt-D",
        "questionId": "olsat-q-021",
        "label": "D",
        "order": 3,
        "optionText": "7",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-021-opt-E",
        "questionId": "olsat-q-021",
        "label": "E",
        "order": 4,
        "optionText": "8",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-022",
    "questionNumber": 22,
    "questionText": "is to ... as ... is to —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 22,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "8594e104-decb-43e2-871e-32d7ce56ba41",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "G",
    "correctOptionId": "olsat-q-022-opt-G",
    "options": [
      {
        "id": "olsat-q-022-opt-F",
        "questionId": "olsat-q-022",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "ca7bed81-47eb-4fd1-8541-33d1f032afad",
        "isCorrect": false
      },
      {
        "id": "olsat-q-022-opt-G",
        "questionId": "olsat-q-022",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "382bd5c0-7584-4b76-8f61-75532a29bc47",
        "isCorrect": true
      },
      {
        "id": "olsat-q-022-opt-H",
        "questionId": "olsat-q-022",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "4665aa66-8a8c-42a0-8d4d-373ac6129b03",
        "isCorrect": false
      },
      {
        "id": "olsat-q-022-opt-J",
        "questionId": "olsat-q-022",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "d9519a91-c7b8-4f58-8c2b-64f39335d209",
        "isCorrect": false
      },
      {
        "id": "olsat-q-022-opt-K",
        "questionId": "olsat-q-022",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "ea87b37a-6180-485e-8981-5066c6e1be03",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-023",
    "questionNumber": 23,
    "questionText": "What comes next in this series?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 23,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "ALPHANUMERIC_SEQUENCE",
      "items": [
        "10C",
        "8A",
        "12E",
        "10C",
        "14G",
        "?"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "A",
    "correctOptionId": "olsat-q-023-opt-A",
    "options": [
      {
        "id": "olsat-q-023-opt-A",
        "questionId": "olsat-q-023",
        "label": "A",
        "order": 0,
        "optionText": "12E",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-023-opt-B",
        "questionId": "olsat-q-023",
        "label": "B",
        "order": 1,
        "optionText": "12G",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-023-opt-C",
        "questionId": "olsat-q-023",
        "label": "C",
        "order": 2,
        "optionText": "14E",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-023-opt-D",
        "questionId": "olsat-q-023",
        "label": "D",
        "order": 3,
        "optionText": "16I",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-023-opt-E",
        "questionId": "olsat-q-023",
        "label": "E",
        "order": 4,
        "optionText": "18K",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-024",
    "questionNumber": 24,
    "questionText": "Paul was born in 1970. Dick was born in 1972. If John is younger than Dick, then we know that —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 24,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-024-opt-F",
    "options": [
      {
        "id": "olsat-q-024-opt-F",
        "questionId": "olsat-q-024",
        "label": "F",
        "order": 0,
        "optionText": "Dick is younger than Paul and older than John",
        "optionTextEmphasis": [
          {
            "start": 0,
            "end": 4,
            "style": "BOLD"
          }
        ],
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-024-opt-G",
        "questionId": "olsat-q-024",
        "label": "G",
        "order": 1,
        "optionText": "Paul is older than Dick and younger than John",
        "optionTextEmphasis": [
          {
            "start": 0,
            "end": 4,
            "style": "BOLD"
          }
        ],
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-024-opt-H",
        "questionId": "olsat-q-024",
        "label": "H",
        "order": 2,
        "optionText": "Paul is younger than Dick and older than John",
        "optionTextEmphasis": [
          {
            "start": 0,
            "end": 4,
            "style": "BOLD"
          }
        ],
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-024-opt-J",
        "questionId": "olsat-q-024",
        "label": "J",
        "order": 3,
        "optionText": "Paul is younger than Dick and John",
        "optionTextEmphasis": [
          {
            "start": 0,
            "end": 4,
            "style": "BOLD"
          }
        ],
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-024-opt-K",
        "questionId": "olsat-q-024",
        "label": "K",
        "order": 4,
        "optionText": "Dick is older than Paul and younger than John",
        "optionTextEmphasis": [
          {
            "start": 0,
            "end": 4,
            "style": "BOLD"
          }
        ],
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-025",
    "questionNumber": 25,
    "questionText": "Which word goes most clearly with the following words?",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 28,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 25,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "WORD_SERIES",
      "items": [
        "peaceful",
        "serene",
        "tranquil",
        "?"
      ]
    },
    "structuredStimulusEmphasis": [
      {
        "index": 0,
        "spans": [
          {
            "start": 0,
            "end": 8,
            "style": "BOLD"
          }
        ]
      },
      {
        "index": 1,
        "spans": [
          {
            "start": 0,
            "end": 6,
            "style": "BOLD"
          }
        ]
      },
      {
        "index": 2,
        "spans": [
          {
            "start": 0,
            "end": 8,
            "style": "BOLD"
          }
        ]
      }
    ],
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-025-opt-E",
    "options": [
      {
        "id": "olsat-q-025-opt-A",
        "questionId": "olsat-q-025",
        "label": "A",
        "order": 0,
        "optionText": "joyous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-025-opt-B",
        "questionId": "olsat-q-025",
        "label": "B",
        "order": 1,
        "optionText": "monotonous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-025-opt-C",
        "questionId": "olsat-q-025",
        "label": "C",
        "order": 2,
        "optionText": "emotional",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-025-opt-D",
        "questionId": "olsat-q-025",
        "label": "D",
        "order": 3,
        "optionText": "sensible",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-025-opt-E",
        "questionId": "olsat-q-025",
        "label": "E",
        "order": 4,
        "optionText": "calm",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-026",
    "questionNumber": 26,
    "questionText": "The numbers in each box go together by following the same rule. Decide what the rule is, and then choose the number that goes where you see the question mark.",
    "questionTextEmphasis": [
      {
        "start": 53,
        "end": 57,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 26,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          20,
          15
        ],
        [
          40,
          30
        ],
        [
          60,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-026-opt-H",
    "options": [
      {
        "id": "olsat-q-026-opt-F",
        "questionId": "olsat-q-026",
        "label": "F",
        "order": 0,
        "optionText": "35",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-026-opt-G",
        "questionId": "olsat-q-026",
        "label": "G",
        "order": 1,
        "optionText": "40",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-026-opt-H",
        "questionId": "olsat-q-026",
        "label": "H",
        "order": 2,
        "optionText": "45",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-026-opt-J",
        "questionId": "olsat-q-026",
        "label": "J",
        "order": 3,
        "optionText": "50",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-026-opt-K",
        "questionId": "olsat-q-026",
        "label": "K",
        "order": 4,
        "optionText": "55",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-027",
    "questionNumber": 27,
    "questionText": "If the words below were arranged to make the best sentence, with which letter would the first word of the sentence begin?",
    "questionTextEmphasis": [
      {
        "start": 45,
        "end": 49,
        "style": "ITALIC"
      },
      {
        "start": 88,
        "end": 93,
        "style": "UNDERLINE"
      },
      {
        "start": 115,
        "end": 120,
        "style": "UNDERLINE"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 27,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "WORD_BANK",
      "items": [
        "here",
        "two",
        "park",
        "blocks",
        "walk",
        "and"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-027-opt-E",
    "options": [
      {
        "id": "olsat-q-027-opt-A",
        "questionId": "olsat-q-027",
        "label": "A",
        "order": 0,
        "optionText": "H",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-027-opt-B",
        "questionId": "olsat-q-027",
        "label": "B",
        "order": 1,
        "optionText": "B",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-027-opt-C",
        "questionId": "olsat-q-027",
        "label": "C",
        "order": 2,
        "optionText": "P",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-027-opt-D",
        "questionId": "olsat-q-027",
        "label": "D",
        "order": 3,
        "optionText": "W",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-027-opt-E",
        "questionId": "olsat-q-027",
        "label": "E",
        "order": 4,
        "optionText": "T",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-028",
    "questionNumber": 28,
    "questionText": "The opposite of discord is —",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 23,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 28,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-028-opt-F",
    "options": [
      {
        "id": "olsat-q-028-opt-F",
        "questionId": "olsat-q-028",
        "label": "F",
        "order": 0,
        "optionText": "harmony",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-028-opt-G",
        "questionId": "olsat-q-028",
        "label": "G",
        "order": 1,
        "optionText": "grace",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-028-opt-H",
        "questionId": "olsat-q-028",
        "label": "H",
        "order": 2,
        "optionText": "tradition",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-028-opt-J",
        "questionId": "olsat-q-028",
        "label": "J",
        "order": 3,
        "optionText": "silence",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-028-opt-K",
        "questionId": "olsat-q-028",
        "label": "K",
        "order": 4,
        "optionText": "friendliness",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-029",
    "questionNumber": 29,
    "questionText": "The drawings in the first part of the row go together to form a series. In the next part of the row, choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 29,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "0ba66902-7083-4af5-80d8-a2febc4eef78",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-029-opt-E",
    "options": [
      {
        "id": "olsat-q-029-opt-A",
        "questionId": "olsat-q-029",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "9b7d1acf-2dbc-433b-8e28-a72613b5057b",
        "isCorrect": false
      },
      {
        "id": "olsat-q-029-opt-B",
        "questionId": "olsat-q-029",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "3d0dcb0a-96f6-4e12-8e5a-e0b4f6a43e10",
        "isCorrect": false
      },
      {
        "id": "olsat-q-029-opt-C",
        "questionId": "olsat-q-029",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "0bbeb014-5148-407a-8d89-f8e6dbe01e2c",
        "isCorrect": false
      },
      {
        "id": "olsat-q-029-opt-D",
        "questionId": "olsat-q-029",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "9c3a9b6c-37ee-43be-8705-4e8929c98e6f",
        "isCorrect": false
      },
      {
        "id": "olsat-q-029-opt-E",
        "questionId": "olsat-q-029",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "8339d2a7-785a-453b-89ec-bc10e1843500",
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-030",
    "questionNumber": 30,
    "questionText": "The numbers in the box go together in a certain way. Choose the number that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 30,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          2,
          8,
          4
        ],
        [
          4,
          16,
          8
        ],
        [
          8,
          "?",
          16
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-030-opt-H",
    "options": [
      {
        "id": "olsat-q-030-opt-F",
        "questionId": "olsat-q-030",
        "label": "F",
        "order": 0,
        "optionText": "12",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-030-opt-G",
        "questionId": "olsat-q-030",
        "label": "G",
        "order": 1,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-030-opt-H",
        "questionId": "olsat-q-030",
        "label": "H",
        "order": 2,
        "optionText": "32",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-030-opt-J",
        "questionId": "olsat-q-030",
        "label": "J",
        "order": 3,
        "optionText": "48",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-030-opt-K",
        "questionId": "olsat-q-030",
        "label": "K",
        "order": 4,
        "optionText": "64",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-031",
    "questionNumber": 31,
    "questionText": "The drawings in the first part of the row go together to form a series. In the next part of the row, choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 31,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "fc7e02d0-bc42-48c7-8220-7dabae5cddbb",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-031-opt-D",
    "options": [
      {
        "id": "olsat-q-031-opt-A",
        "questionId": "olsat-q-031",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "f5eb52c0-e300-4c60-8c9f-8682d9604a55",
        "isCorrect": false
      },
      {
        "id": "olsat-q-031-opt-B",
        "questionId": "olsat-q-031",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "c59c2d21-43a7-42cc-84d1-cc2096c4aa59",
        "isCorrect": false
      },
      {
        "id": "olsat-q-031-opt-C",
        "questionId": "olsat-q-031",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "8095dad8-9239-4974-80ab-c390b3141950",
        "isCorrect": false
      },
      {
        "id": "olsat-q-031-opt-D",
        "questionId": "olsat-q-031",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "8f74316b-79ae-4470-838d-d188e9024625",
        "isCorrect": true
      },
      {
        "id": "olsat-q-031-opt-E",
        "questionId": "olsat-q-031",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "69081231-0a32-4f1b-8774-2dbc0c5f3177",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-032",
    "questionNumber": 32,
    "questionText": "is to ... as ... is to —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 32,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "5569d800-3ced-4ada-8aa8-e5d9f4d40354",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-032-opt-F",
    "options": [
      {
        "id": "olsat-q-032-opt-F",
        "questionId": "olsat-q-032",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "a976c583-ccef-4723-8a16-0dcb2b593a3b",
        "isCorrect": true
      },
      {
        "id": "olsat-q-032-opt-G",
        "questionId": "olsat-q-032",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "ef063ba7-605e-4bff-822a-3e470fc058ad",
        "isCorrect": false
      },
      {
        "id": "olsat-q-032-opt-H",
        "questionId": "olsat-q-032",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "8420ca55-16e3-4354-8574-c47159d151c7",
        "isCorrect": false
      },
      {
        "id": "olsat-q-032-opt-J",
        "questionId": "olsat-q-032",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "5baba26e-23e5-4d55-82f4-1a4e77245b77",
        "isCorrect": false
      },
      {
        "id": "olsat-q-032-opt-K",
        "questionId": "olsat-q-032",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "cb4d1e6d-09ed-4eea-82c3-0742314f4cbe",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-033",
    "questionNumber": 33,
    "questionText": "Possible is to maybe as probable is to —",
    "questionTextEmphasis": [
      {
        "start": 0,
        "end": 8,
        "style": "BOLD"
      },
      {
        "start": 15,
        "end": 20,
        "style": "BOLD"
      },
      {
        "start": 24,
        "end": 32,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 33,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-033-opt-E",
    "options": [
      {
        "id": "olsat-q-033-opt-A",
        "questionId": "olsat-q-033",
        "label": "A",
        "order": 0,
        "optionText": "gradually",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-033-opt-B",
        "questionId": "olsat-q-033",
        "label": "B",
        "order": 1,
        "optionText": "hopefully",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-033-opt-C",
        "questionId": "olsat-q-033",
        "label": "C",
        "order": 2,
        "optionText": "certainly",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-033-opt-D",
        "questionId": "olsat-q-033",
        "label": "D",
        "order": 3,
        "optionText": "eventually",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-033-opt-E",
        "questionId": "olsat-q-033",
        "label": "E",
        "order": 4,
        "optionText": "likely",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-034",
    "questionNumber": 34,
    "questionText": "Mr. and Mrs. DiNapoli have two sons and three daughters. When the whole family is together for dinner, they have to bring one extra chair to the table. How many chairs do they usually have around the table?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 34,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "K",
    "correctOptionId": "olsat-q-034-opt-K",
    "options": [
      {
        "id": "olsat-q-034-opt-F",
        "questionId": "olsat-q-034",
        "label": "F",
        "order": 0,
        "optionText": "4",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-034-opt-G",
        "questionId": "olsat-q-034",
        "label": "G",
        "order": 1,
        "optionText": "5",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-034-opt-H",
        "questionId": "olsat-q-034",
        "label": "H",
        "order": 2,
        "optionText": "6",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-034-opt-J",
        "questionId": "olsat-q-034",
        "label": "J",
        "order": 3,
        "optionText": "7",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-034-opt-K",
        "questionId": "olsat-q-034",
        "label": "K",
        "order": 4,
        "optionText": "8",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-035",
    "questionNumber": 35,
    "questionText": "The opposite of moderate is —",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 24,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 35,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-035-opt-E",
    "options": [
      {
        "id": "olsat-q-035-opt-A",
        "questionId": "olsat-q-035",
        "label": "A",
        "order": 0,
        "optionText": "sudden",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-035-opt-B",
        "questionId": "olsat-q-035",
        "label": "B",
        "order": 1,
        "optionText": "swift",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-035-opt-C",
        "questionId": "olsat-q-035",
        "label": "C",
        "order": 2,
        "optionText": "treacherous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-035-opt-D",
        "questionId": "olsat-q-035",
        "label": "D",
        "order": 3,
        "optionText": "violent",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-035-opt-E",
        "questionId": "olsat-q-035",
        "label": "E",
        "order": 4,
        "optionText": "extreme",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-036",
    "questionNumber": 36,
    "questionText": "The numbers in the box go together in a certain way. Choose the number that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 36,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          1,
          "1/2",
          "1/4"
        ],
        [
          "1/2",
          "1/4",
          "1/8"
        ],
        [
          "1/4",
          "?",
          "1/16"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-036-opt-J",
    "options": [
      {
        "id": "olsat-q-036-opt-F",
        "questionId": "olsat-q-036",
        "label": "F",
        "order": 0,
        "optionText": "1/2",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-036-opt-G",
        "questionId": "olsat-q-036",
        "label": "G",
        "order": 1,
        "optionText": "1/3",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-036-opt-H",
        "questionId": "olsat-q-036",
        "label": "H",
        "order": 2,
        "optionText": "1/6",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-036-opt-J",
        "questionId": "olsat-q-036",
        "label": "J",
        "order": 3,
        "optionText": "1/8",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-036-opt-K",
        "questionId": "olsat-q-036",
        "label": "K",
        "order": 4,
        "optionText": "1/12",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-037",
    "questionNumber": 37,
    "questionText": "The groups of letters in the box go together in a certain way. Choose the group of letters that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 37,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          "ABCD",
          "ADCB",
          "CDAB"
        ],
        [
          "WXYZ",
          "WZYX",
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-037-opt-D",
    "options": [
      {
        "id": "olsat-q-037-opt-A",
        "questionId": "olsat-q-037",
        "label": "A",
        "order": 0,
        "optionText": "WXZY",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-037-opt-B",
        "questionId": "olsat-q-037",
        "label": "B",
        "order": 1,
        "optionText": "XYZW",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-037-opt-C",
        "questionId": "olsat-q-037",
        "label": "C",
        "order": 2,
        "optionText": "YXZW",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-037-opt-D",
        "questionId": "olsat-q-037",
        "label": "D",
        "order": 3,
        "optionText": "YZWX",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-037-opt-E",
        "questionId": "olsat-q-037",
        "label": "E",
        "order": 4,
        "optionText": "ZYXW",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-038",
    "questionNumber": 38,
    "questionText": "Every country must have —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 38,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "K",
    "correctOptionId": "olsat-q-038-opt-K",
    "options": [
      {
        "id": "olsat-q-038-opt-F",
        "questionId": "olsat-q-038",
        "label": "F",
        "order": 0,
        "optionText": "coasts",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-038-opt-G",
        "questionId": "olsat-q-038",
        "label": "G",
        "order": 1,
        "optionText": "a president",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-038-opt-H",
        "questionId": "olsat-q-038",
        "label": "H",
        "order": 2,
        "optionText": "boundaries",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-038-opt-J",
        "questionId": "olsat-q-038",
        "label": "J",
        "order": 3,
        "optionText": "a navy",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-038-opt-K",
        "questionId": "olsat-q-038",
        "label": "K",
        "order": 4,
        "optionText": "a flag",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-039",
    "questionNumber": 39,
    "questionText": "What number is missing from this series?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 39,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "NUMBER_SEQUENCE",
      "items": [
        4,
        8,
        6,
        12,
        10,
        "?",
        18,
        36
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-039-opt-D",
    "options": [
      {
        "id": "olsat-q-039-opt-A",
        "questionId": "olsat-q-039",
        "label": "A",
        "order": 0,
        "optionText": "8",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-039-opt-B",
        "questionId": "olsat-q-039",
        "label": "B",
        "order": 1,
        "optionText": "14",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-039-opt-C",
        "questionId": "olsat-q-039",
        "label": "C",
        "order": 2,
        "optionText": "16",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-039-opt-D",
        "questionId": "olsat-q-039",
        "label": "D",
        "order": 3,
        "optionText": "20",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-039-opt-E",
        "questionId": "olsat-q-039",
        "label": "E",
        "order": 4,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-040",
    "questionNumber": 40,
    "questionText": "Assume that —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 40,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "LOGICAL_PREMISES",
      "items": [
        "All As are Cs.",
        "Some Ds are Cs.",
        "No Bs are Cs.",
        "We know that —"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "G",
    "correctOptionId": "olsat-q-040-opt-G",
    "options": [
      {
        "id": "olsat-q-040-opt-F",
        "questionId": "olsat-q-040",
        "label": "F",
        "order": 0,
        "optionText": "no As are Ds",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-040-opt-G",
        "questionId": "olsat-q-040",
        "label": "G",
        "order": 1,
        "optionText": "no As are Bs",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-040-opt-H",
        "questionId": "olsat-q-040",
        "label": "H",
        "order": 2,
        "optionText": "some Bs are Ds",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-040-opt-J",
        "questionId": "olsat-q-040",
        "label": "J",
        "order": 3,
        "optionText": "no As are both Cs and Ds",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-040-opt-K",
        "questionId": "olsat-q-040",
        "label": "K",
        "order": 4,
        "optionText": "no Ds are Bs",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-041",
    "questionNumber": 41,
    "questionText": "is to ... as ... is to —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 41,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "3a063b12-59d8-4b3d-8b89-13744b1adcb9",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-041-opt-E",
    "options": [
      {
        "id": "olsat-q-041-opt-A",
        "questionId": "olsat-q-041",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "1c9141d8-27c7-4ff7-89e1-de3a0781ca26",
        "isCorrect": false
      },
      {
        "id": "olsat-q-041-opt-B",
        "questionId": "olsat-q-041",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "e59a7d53-d006-48a0-8c0c-884b75acf2de",
        "isCorrect": false
      },
      {
        "id": "olsat-q-041-opt-C",
        "questionId": "olsat-q-041",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "127948eb-169c-45c9-8742-e9a734f8099c",
        "isCorrect": false
      },
      {
        "id": "olsat-q-041-opt-D",
        "questionId": "olsat-q-041",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "461b691c-7b18-4635-8d61-426103b5dc91",
        "isCorrect": false
      },
      {
        "id": "olsat-q-041-opt-E",
        "questionId": "olsat-q-041",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "5b8c0936-14ca-45e7-869d-b03966d3ae23",
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-042",
    "questionNumber": 42,
    "questionText": "The numbers in each box go together by following the same rule. Decide what the rule is, and then choose the number that goes where you see the question mark.",
    "questionTextEmphasis": [
      {
        "start": 53,
        "end": 57,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 42,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "GROUPED_NUMBER_ROWS",
      "groups": [
        [
          1,
          4,
          10
        ],
        [
          3,
          6,
          12
        ],
        [
          5,
          8,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "G",
    "correctOptionId": "olsat-q-042-opt-G",
    "options": [
      {
        "id": "olsat-q-042-opt-F",
        "questionId": "olsat-q-042",
        "label": "F",
        "order": 0,
        "optionText": "13",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-042-opt-G",
        "questionId": "olsat-q-042",
        "label": "G",
        "order": 1,
        "optionText": "14",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-042-opt-H",
        "questionId": "olsat-q-042",
        "label": "H",
        "order": 2,
        "optionText": "15",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-042-opt-J",
        "questionId": "olsat-q-042",
        "label": "J",
        "order": 3,
        "optionText": "16",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-042-opt-K",
        "questionId": "olsat-q-042",
        "label": "K",
        "order": 4,
        "optionText": "18",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-043",
    "questionNumber": 43,
    "questionText": "The drawings in the box go together in a certain way. Choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 43,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "6d042f3a-83c1-435b-8540-490898176799",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "A",
    "correctOptionId": "olsat-q-043-opt-A",
    "options": [
      {
        "id": "olsat-q-043-opt-A",
        "questionId": "olsat-q-043",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "b13de97a-03e3-49de-82b1-74f0742695a4",
        "isCorrect": true
      },
      {
        "id": "olsat-q-043-opt-B",
        "questionId": "olsat-q-043",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "89cacf66-3c9a-4723-8ca6-29aea66ef0b4",
        "isCorrect": false
      },
      {
        "id": "olsat-q-043-opt-C",
        "questionId": "olsat-q-043",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "bf4a7c89-9483-40f9-8f50-7f71542810fb",
        "isCorrect": false
      },
      {
        "id": "olsat-q-043-opt-D",
        "questionId": "olsat-q-043",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "3f86fdf9-f8fb-404c-82d0-4fa2241d33c6",
        "isCorrect": false
      },
      {
        "id": "olsat-q-043-opt-E",
        "questionId": "olsat-q-043",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "5c1ed039-e99f-456b-8516-180be2560ea9",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-044",
    "questionNumber": 44,
    "questionText": "The numbers in the box go together in a certain way. Choose the number that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 44,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          10,
          7,
          21
        ],
        [
          8,
          5,
          15
        ],
        [
          12,
          9,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-044-opt-J",
    "options": [
      {
        "id": "olsat-q-044-opt-F",
        "questionId": "olsat-q-044",
        "label": "F",
        "order": 0,
        "optionText": "19",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-044-opt-G",
        "questionId": "olsat-q-044",
        "label": "G",
        "order": 1,
        "optionText": "21",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-044-opt-H",
        "questionId": "olsat-q-044",
        "label": "H",
        "order": 2,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-044-opt-J",
        "questionId": "olsat-q-044",
        "label": "J",
        "order": 3,
        "optionText": "27",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-044-opt-K",
        "questionId": "olsat-q-044",
        "label": "K",
        "order": 4,
        "optionText": "36",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-045",
    "questionNumber": 45,
    "questionText": "Which word goes most clearly with the following words?",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 28,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 45,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "WORD_SERIES",
      "items": [
        "forward",
        "sideways",
        "down",
        "?"
      ]
    },
    "structuredStimulusEmphasis": [
      {
        "index": 0,
        "spans": [
          {
            "start": 0,
            "end": 7,
            "style": "BOLD"
          }
        ]
      },
      {
        "index": 1,
        "spans": [
          {
            "start": 0,
            "end": 8,
            "style": "BOLD"
          }
        ]
      },
      {
        "index": 2,
        "spans": [
          {
            "start": 0,
            "end": 4,
            "style": "BOLD"
          }
        ]
      }
    ],
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-045-opt-E",
    "options": [
      {
        "id": "olsat-q-045-opt-A",
        "questionId": "olsat-q-045",
        "label": "A",
        "order": 0,
        "optionText": "top",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-045-opt-B",
        "questionId": "olsat-q-045",
        "label": "B",
        "order": 1,
        "optionText": "up",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-045-opt-C",
        "questionId": "olsat-q-045",
        "label": "C",
        "order": 2,
        "optionText": "above",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-045-opt-D",
        "questionId": "olsat-q-045",
        "label": "D",
        "order": 3,
        "optionText": "over",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-045-opt-E",
        "questionId": "olsat-q-045",
        "label": "E",
        "order": 4,
        "optionText": "beyond",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-046",
    "questionNumber": 46,
    "questionText": "What number is equal to one-third of the difference between the squares of ten and eight?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 46,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-046-opt-H",
    "options": [
      {
        "id": "olsat-q-046-opt-F",
        "questionId": "olsat-q-046",
        "label": "F",
        "order": 0,
        "optionText": "3",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-046-opt-G",
        "questionId": "olsat-q-046",
        "label": "G",
        "order": 1,
        "optionText": "6",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-046-opt-H",
        "questionId": "olsat-q-046",
        "label": "H",
        "order": 2,
        "optionText": "12",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-046-opt-J",
        "questionId": "olsat-q-046",
        "label": "J",
        "order": 3,
        "optionText": "18",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-046-opt-K",
        "questionId": "olsat-q-046",
        "label": "K",
        "order": 4,
        "optionText": "36",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-047",
    "questionNumber": 47,
    "questionText": "What letter comes next in this series?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 47,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "LETTER_SEQUENCE",
      "items": [
        "H",
        "I",
        "K",
        "L",
        "N",
        "O",
        "?"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "C",
    "correctOptionId": "olsat-q-047-opt-C",
    "options": [
      {
        "id": "olsat-q-047-opt-A",
        "questionId": "olsat-q-047",
        "label": "A",
        "order": 0,
        "optionText": "M",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-047-opt-B",
        "questionId": "olsat-q-047",
        "label": "B",
        "order": 1,
        "optionText": "P",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-047-opt-C",
        "questionId": "olsat-q-047",
        "label": "C",
        "order": 2,
        "optionText": "Q",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-047-opt-D",
        "questionId": "olsat-q-047",
        "label": "D",
        "order": 3,
        "optionText": "R",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-047-opt-E",
        "questionId": "olsat-q-047",
        "label": "E",
        "order": 4,
        "optionText": "S",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-048",
    "questionNumber": 48,
    "questionText": "The drawings in the box go together in a certain way. Choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 48,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "4472da84-e9c7-4c98-8f3d-26191e5ecca4",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-048-opt-F",
    "options": [
      {
        "id": "olsat-q-048-opt-F",
        "questionId": "olsat-q-048",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "88754f13-b330-4f74-81b7-d722d5fb6d33",
        "isCorrect": true
      },
      {
        "id": "olsat-q-048-opt-G",
        "questionId": "olsat-q-048",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "1bfff723-11ae-4052-8c08-7cddce7ace10",
        "isCorrect": false
      },
      {
        "id": "olsat-q-048-opt-H",
        "questionId": "olsat-q-048",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "bd2282e2-e677-432d-8ad0-f8cc34acaec2",
        "isCorrect": false
      },
      {
        "id": "olsat-q-048-opt-J",
        "questionId": "olsat-q-048",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "35b830ee-9244-42cf-8b8c-d76a6658fdec",
        "isCorrect": false
      },
      {
        "id": "olsat-q-048-opt-K",
        "questionId": "olsat-q-048",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "fb6dabf7-fc23-4add-88f3-a7ec493144a2",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-049",
    "questionNumber": 49,
    "questionText": "The numbers in each box go together by following the same rule. Decide what the rule is, and then choose the number that goes where you see the question mark.",
    "questionTextEmphasis": [
      {
        "start": 53,
        "end": 57,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 49,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "GROUPED_NUMBER_ROWS",
      "groups": [
        [
          6,
          18,
          16
        ],
        [
          10,
          30,
          28
        ],
        [
          15,
          45,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "C",
    "correctOptionId": "olsat-q-049-opt-C",
    "options": [
      {
        "id": "olsat-q-049-opt-A",
        "questionId": "olsat-q-049",
        "label": "A",
        "order": 0,
        "optionText": "35",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-049-opt-B",
        "questionId": "olsat-q-049",
        "label": "B",
        "order": 1,
        "optionText": "40",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-049-opt-C",
        "questionId": "olsat-q-049",
        "label": "C",
        "order": 2,
        "optionText": "43",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-049-opt-D",
        "questionId": "olsat-q-049",
        "label": "D",
        "order": 3,
        "optionText": "48",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-049-opt-E",
        "questionId": "olsat-q-049",
        "label": "E",
        "order": 4,
        "optionText": "60",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-050",
    "questionNumber": 50,
    "questionText": "Electricity is to light bulb as —",
    "questionTextEmphasis": [
      {
        "start": 0,
        "end": 11,
        "style": "BOLD"
      },
      {
        "start": 18,
        "end": 28,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 50,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-050-opt-H",
    "options": [
      {
        "id": "olsat-q-050-opt-F",
        "questionId": "olsat-q-050",
        "label": "F",
        "order": 0,
        "optionText": "furnace is to heat",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-050-opt-G",
        "questionId": "olsat-q-050",
        "label": "G",
        "order": 1,
        "optionText": "steam is to radiator",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-050-opt-H",
        "questionId": "olsat-q-050",
        "label": "H",
        "order": 2,
        "optionText": "water is to dam",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-050-opt-J",
        "questionId": "olsat-q-050",
        "label": "J",
        "order": 3,
        "optionText": "fuel is to engine",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-050-opt-K",
        "questionId": "olsat-q-050",
        "label": "K",
        "order": 4,
        "optionText": "smoke is to fire",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-051",
    "questionNumber": 51,
    "questionText": "The numbers in each box go together by following the same rule. Decide what the rule is, and then choose the number that goes where you see the question mark.",
    "questionTextEmphasis": [
      {
        "start": 53,
        "end": 57,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 51,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "GROUPED_NUMBER_ROWS",
      "groups": [
        [
          2,
          4,
          8
        ],
        [
          3,
          9,
          "?"
        ],
        [
          4,
          16,
          20
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "B",
    "correctOptionId": "olsat-q-051-opt-B",
    "options": [
      {
        "id": "olsat-q-051-opt-A",
        "questionId": "olsat-q-051",
        "label": "A",
        "order": 0,
        "optionText": "11",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-051-opt-B",
        "questionId": "olsat-q-051",
        "label": "B",
        "order": 1,
        "optionText": "13",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-051-opt-C",
        "questionId": "olsat-q-051",
        "label": "C",
        "order": 2,
        "optionText": "18",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-051-opt-D",
        "questionId": "olsat-q-051",
        "label": "D",
        "order": 3,
        "optionText": "27",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-051-opt-E",
        "questionId": "olsat-q-051",
        "label": "E",
        "order": 4,
        "optionText": "36",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-052",
    "questionNumber": 52,
    "questionText": "The words in the box go together in a certain way. Choose the word that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 52,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          "steel",
          "shovel",
          "dig"
        ],
        [
          "china",
          "pitcher",
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-052-opt-H",
    "options": [
      {
        "id": "olsat-q-052-opt-F",
        "questionId": "olsat-q-052",
        "label": "F",
        "order": 0,
        "optionText": "glass",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-052-opt-G",
        "questionId": "olsat-q-052",
        "label": "G",
        "order": 1,
        "optionText": "cup",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-052-opt-H",
        "questionId": "olsat-q-052",
        "label": "H",
        "order": 2,
        "optionText": "pour",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-052-opt-J",
        "questionId": "olsat-q-052",
        "label": "J",
        "order": 3,
        "optionText": "milk",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-052-opt-K",
        "questionId": "olsat-q-052",
        "label": "K",
        "order": 4,
        "optionText": "break",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-053",
    "questionNumber": 53,
    "questionText": "There can be no message if there is no —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 53,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-053-opt-D",
    "options": [
      {
        "id": "olsat-q-053-opt-A",
        "questionId": "olsat-q-053",
        "label": "A",
        "order": 0,
        "optionText": "word",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-053-opt-B",
        "questionId": "olsat-q-053",
        "label": "B",
        "order": 1,
        "optionText": "note",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-053-opt-C",
        "questionId": "olsat-q-053",
        "label": "C",
        "order": 2,
        "optionText": "messenger",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-053-opt-D",
        "questionId": "olsat-q-053",
        "label": "D",
        "order": 3,
        "optionText": "thought",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-053-opt-E",
        "questionId": "olsat-q-053",
        "label": "E",
        "order": 4,
        "optionText": "pencil",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-054",
    "questionNumber": 54,
    "questionText": "The drawings in the first part of the row go together to form a series. In the next part of the row, choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 54,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "e6acea32-ed55-4a6c-864b-1ee4c015d29e",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-054-opt-F",
    "options": [
      {
        "id": "olsat-q-054-opt-F",
        "questionId": "olsat-q-054",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "c8b7ca72-8d0f-4ae5-8e24-5220402e2de3",
        "isCorrect": true
      },
      {
        "id": "olsat-q-054-opt-G",
        "questionId": "olsat-q-054",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "e4d6e8e2-93c0-4b3f-8dfe-1c4e3cb67685",
        "isCorrect": false
      },
      {
        "id": "olsat-q-054-opt-H",
        "questionId": "olsat-q-054",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "8c5c4d5e-8428-41e8-817b-62cb740f9fd6",
        "isCorrect": false
      },
      {
        "id": "olsat-q-054-opt-J",
        "questionId": "olsat-q-054",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "754a11a3-8588-48ec-8453-79c8047cdd11",
        "isCorrect": false
      },
      {
        "id": "olsat-q-054-opt-K",
        "questionId": "olsat-q-054",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "a3ca272a-971a-4c74-8fab-7174cc3dcbf1",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-055",
    "questionNumber": 55,
    "questionText": "Choose the words that best complete this sentence: The evidence against him was ______ so the charges were ______.",
    "questionTextEmphasis": [
      {
        "start": 22,
        "end": 26,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 55,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-055-opt-E",
    "options": [
      {
        "id": "olsat-q-055-opt-A",
        "questionId": "olsat-q-055",
        "label": "A",
        "order": 0,
        "optionText": "convincing — dropped",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-055-opt-B",
        "questionId": "olsat-q-055",
        "label": "B",
        "order": 1,
        "optionText": "feeble — extended",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-055-opt-C",
        "questionId": "olsat-q-055",
        "label": "C",
        "order": 2,
        "optionText": "overwhelming — reduced",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-055-opt-D",
        "questionId": "olsat-q-055",
        "label": "D",
        "order": 3,
        "optionText": "damaging — withdrawn",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-055-opt-E",
        "questionId": "olsat-q-055",
        "label": "E",
        "order": 4,
        "optionText": "unsupported — dismissed",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-056",
    "questionNumber": 56,
    "questionText": "The drawings in the box go together in a certain way. Choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 56,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "34c4a1b5-3dd9-416d-84e7-096b40d702e9",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "G",
    "correctOptionId": "olsat-q-056-opt-G",
    "options": [
      {
        "id": "olsat-q-056-opt-F",
        "questionId": "olsat-q-056",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "877ec8d8-ddb7-4375-8772-2ce9bef2bcef",
        "isCorrect": false
      },
      {
        "id": "olsat-q-056-opt-G",
        "questionId": "olsat-q-056",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "2d201c51-09f0-4a83-8192-8b38a470780b",
        "isCorrect": true
      },
      {
        "id": "olsat-q-056-opt-H",
        "questionId": "olsat-q-056",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "7e89c060-f699-4916-81f4-a0557910d1f2",
        "isCorrect": false
      },
      {
        "id": "olsat-q-056-opt-J",
        "questionId": "olsat-q-056",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "9201354d-9b4d-4d55-861f-9b6986172a86",
        "isCorrect": false
      },
      {
        "id": "olsat-q-056-opt-K",
        "questionId": "olsat-q-056",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "463b82ab-c623-442a-8d69-5880f23c83db",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-057",
    "questionNumber": 57,
    "questionText": "The opposite of scarcity is —",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 24,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 57,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-057-opt-E",
    "options": [
      {
        "id": "olsat-q-057-opt-A",
        "questionId": "olsat-q-057",
        "label": "A",
        "order": 0,
        "optionText": "necessity",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-057-opt-B",
        "questionId": "olsat-q-057",
        "label": "B",
        "order": 1,
        "optionText": "bonus",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-057-opt-C",
        "questionId": "olsat-q-057",
        "label": "C",
        "order": 2,
        "optionText": "privilege",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-057-opt-D",
        "questionId": "olsat-q-057",
        "label": "D",
        "order": 3,
        "optionText": "abundance",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-057-opt-E",
        "questionId": "olsat-q-057",
        "label": "E",
        "order": 4,
        "optionText": "expansion",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-058",
    "questionNumber": 58,
    "questionText": "In a foreign language tana dona meka means very cold water, tana neta means hot water, and dona bela means very good. Which word means cold?",
    "questionTextEmphasis": [
      {
        "start": 22,
        "end": 36,
        "style": "BOLD"
      },
      {
        "start": 43,
        "end": 58,
        "style": "BOLD"
      },
      {
        "start": 60,
        "end": 69,
        "style": "BOLD"
      },
      {
        "start": 76,
        "end": 85,
        "style": "BOLD"
      },
      {
        "start": 91,
        "end": 100,
        "style": "BOLD"
      },
      {
        "start": 107,
        "end": 116,
        "style": "BOLD"
      },
      {
        "start": 135,
        "end": 139,
        "style": "BOLD"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 58,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "K",
    "correctOptionId": "olsat-q-058-opt-K",
    "options": [
      {
        "id": "olsat-q-058-opt-F",
        "questionId": "olsat-q-058",
        "label": "F",
        "order": 0,
        "optionText": "dona",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-058-opt-G",
        "questionId": "olsat-q-058",
        "label": "G",
        "order": 1,
        "optionText": "neta",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-058-opt-H",
        "questionId": "olsat-q-058",
        "label": "H",
        "order": 2,
        "optionText": "tana",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-058-opt-J",
        "questionId": "olsat-q-058",
        "label": "J",
        "order": 3,
        "optionText": "bela",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-058-opt-K",
        "questionId": "olsat-q-058",
        "label": "K",
        "order": 4,
        "optionText": "meka",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-059",
    "questionNumber": 59,
    "questionText": "is to ... as ... is to —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 59,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "e416bfc8-6099-40b6-8373-df3074c2a1a3",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "D",
    "correctOptionId": "olsat-q-059-opt-D",
    "options": [
      {
        "id": "olsat-q-059-opt-A",
        "questionId": "olsat-q-059",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "771ab466-ba24-4425-8a77-51f67f6b58b6",
        "isCorrect": false
      },
      {
        "id": "olsat-q-059-opt-B",
        "questionId": "olsat-q-059",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "bf0f1738-4680-4129-81ca-28c59ff9eca6",
        "isCorrect": false
      },
      {
        "id": "olsat-q-059-opt-C",
        "questionId": "olsat-q-059",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "4a26536a-9540-4ec6-8c5e-7ad2df151427",
        "isCorrect": false
      },
      {
        "id": "olsat-q-059-opt-D",
        "questionId": "olsat-q-059",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "c1d6e03e-4537-4af7-8b5e-a89e3ae30cd5",
        "isCorrect": true
      },
      {
        "id": "olsat-q-059-opt-E",
        "questionId": "olsat-q-059",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "9bfee0db-6398-43bb-8d8a-c04b9887dfb6",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-060",
    "questionNumber": 60,
    "questionText": "What number comes next in this series?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 60,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "NUMBER_SEQUENCE",
      "items": [
        5,
        11,
        16,
        20,
        23,
        "?"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "G",
    "correctOptionId": "olsat-q-060-opt-G",
    "options": [
      {
        "id": "olsat-q-060-opt-F",
        "questionId": "olsat-q-060",
        "label": "F",
        "order": 0,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-060-opt-G",
        "questionId": "olsat-q-060",
        "label": "G",
        "order": 1,
        "optionText": "25",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-060-opt-H",
        "questionId": "olsat-q-060",
        "label": "H",
        "order": 2,
        "optionText": "27",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-060-opt-J",
        "questionId": "olsat-q-060",
        "label": "J",
        "order": 3,
        "optionText": "28",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-060-opt-K",
        "questionId": "olsat-q-060",
        "label": "K",
        "order": 4,
        "optionText": "29",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-061",
    "questionNumber": 61,
    "questionText": "Which word does not go with the other four?",
    "questionTextEmphasis": [
      {
        "start": 16,
        "end": 19,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 61,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-061-opt-E",
    "options": [
      {
        "id": "olsat-q-061-opt-A",
        "questionId": "olsat-q-061",
        "label": "A",
        "order": 0,
        "optionText": "dangerous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-061-opt-B",
        "questionId": "olsat-q-061",
        "label": "B",
        "order": 1,
        "optionText": "risky",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-061-opt-C",
        "questionId": "olsat-q-061",
        "label": "C",
        "order": 2,
        "optionText": "hazardous",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-061-opt-D",
        "questionId": "olsat-q-061",
        "label": "D",
        "order": 3,
        "optionText": "unsafe",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-061-opt-E",
        "questionId": "olsat-q-061",
        "label": "E",
        "order": 4,
        "optionText": "frightened",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-062",
    "questionNumber": 62,
    "questionText": "If the words below were arranged to make the best sentence, with which letter would the last word of the sentence begin?",
    "questionTextEmphasis": [
      {
        "start": 45,
        "end": 49,
        "style": "ITALIC"
      },
      {
        "start": 88,
        "end": 92,
        "style": "UNDERLINE"
      },
      {
        "start": 114,
        "end": 119,
        "style": "UNDERLINE"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 62,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "WORD_BANK",
      "items": [
        "live",
        "many",
        "of",
        "groups",
        "in",
        "animals"
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "K",
    "correctOptionId": "olsat-q-062-opt-K",
    "options": [
      {
        "id": "olsat-q-062-opt-F",
        "questionId": "olsat-q-062",
        "label": "F",
        "order": 0,
        "optionText": "a",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-062-opt-G",
        "questionId": "olsat-q-062",
        "label": "G",
        "order": 1,
        "optionText": "g",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-062-opt-H",
        "questionId": "olsat-q-062",
        "label": "H",
        "order": 2,
        "optionText": "s",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-062-opt-J",
        "questionId": "olsat-q-062",
        "label": "J",
        "order": 3,
        "optionText": "m",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-062-opt-K",
        "questionId": "olsat-q-062",
        "label": "K",
        "order": 4,
        "optionText": "i",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-063",
    "questionNumber": 63,
    "questionText": "The drawings in the first part of the row go together to form a series. In the next part of the row, choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 63,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "869a9854-bb11-44d3-80e4-241cd05316ff",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "B",
    "correctOptionId": "olsat-q-063-opt-B",
    "options": [
      {
        "id": "olsat-q-063-opt-A",
        "questionId": "olsat-q-063",
        "label": "A",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "b4057edb-e78d-4e6a-8c5d-0f99d1fea8d5",
        "isCorrect": false
      },
      {
        "id": "olsat-q-063-opt-B",
        "questionId": "olsat-q-063",
        "label": "B",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "4ddc07f5-ce0c-41d4-8297-fd453644b471",
        "isCorrect": true
      },
      {
        "id": "olsat-q-063-opt-C",
        "questionId": "olsat-q-063",
        "label": "C",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "40251138-7cd4-405c-83ab-5d417f940135",
        "isCorrect": false
      },
      {
        "id": "olsat-q-063-opt-D",
        "questionId": "olsat-q-063",
        "label": "D",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "50ded124-e8fd-43b7-87f9-7c5d5d9a4f2f",
        "isCorrect": false
      },
      {
        "id": "olsat-q-063-opt-E",
        "questionId": "olsat-q-063",
        "label": "E",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "ac53c4d1-70cf-4c16-803c-2b089d7f5e80",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-064",
    "questionNumber": 64,
    "questionText": "The numbers in each box go together by following the same rule. Decide what the rule is, and then choose the number that goes where you see the question mark.",
    "questionTextEmphasis": [
      {
        "start": 53,
        "end": 57,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 64,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "GROUPED_NUMBER_ROWS",
      "groups": [
        [
          16,
          "?",
          2
        ],
        [
          54,
          27,
          3
        ],
        [
          128,
          64,
          4
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "H",
    "correctOptionId": "olsat-q-064-opt-H",
    "options": [
      {
        "id": "olsat-q-064-opt-F",
        "questionId": "olsat-q-064",
        "label": "F",
        "order": 0,
        "optionText": "4",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-064-opt-G",
        "questionId": "olsat-q-064",
        "label": "G",
        "order": 1,
        "optionText": "6",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-064-opt-H",
        "questionId": "olsat-q-064",
        "label": "H",
        "order": 2,
        "optionText": "8",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-064-opt-J",
        "questionId": "olsat-q-064",
        "label": "J",
        "order": 3,
        "optionText": "10",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-064-opt-K",
        "questionId": "olsat-q-064",
        "label": "K",
        "order": 4,
        "optionText": "12",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-065",
    "questionNumber": 65,
    "questionText": "A cloud is always —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 65,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "B",
    "correctOptionId": "olsat-q-065-opt-B",
    "options": [
      {
        "id": "olsat-q-065-opt-A",
        "questionId": "olsat-q-065",
        "label": "A",
        "order": 0,
        "optionText": "humid",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-065-opt-B",
        "questionId": "olsat-q-065",
        "label": "B",
        "order": 1,
        "optionText": "fluffy",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-065-opt-C",
        "questionId": "olsat-q-065",
        "label": "C",
        "order": 2,
        "optionText": "white",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-065-opt-D",
        "questionId": "olsat-q-065",
        "label": "D",
        "order": 3,
        "optionText": "big",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-065-opt-E",
        "questionId": "olsat-q-065",
        "label": "E",
        "order": 4,
        "optionText": "high",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-066",
    "questionNumber": 66,
    "questionText": "The drawings in the box go together in a certain way. Choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 66,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "45ce126e-960f-4d2f-8d18-00a12710b143",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-066-opt-J",
    "options": [
      {
        "id": "olsat-q-066-opt-F",
        "questionId": "olsat-q-066",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "4460fd70-7204-4938-8bb3-5d7b6b2d08b3",
        "isCorrect": false
      },
      {
        "id": "olsat-q-066-opt-G",
        "questionId": "olsat-q-066",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "c2ccfb4d-0a51-4972-8672-9ef1ff6e0d2b",
        "isCorrect": false
      },
      {
        "id": "olsat-q-066-opt-H",
        "questionId": "olsat-q-066",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "96799d28-8178-4687-8079-c66e4e4299ee",
        "isCorrect": false
      },
      {
        "id": "olsat-q-066-opt-J",
        "questionId": "olsat-q-066",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "651f2264-8361-4f78-810d-e86881e64fe1",
        "isCorrect": true
      },
      {
        "id": "olsat-q-066-opt-K",
        "questionId": "olsat-q-066",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "f479bd84-3654-4ded-812e-3b4cb1d9406a",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-067",
    "questionNumber": 67,
    "questionText": "The words in the box go together in a certain way. Choose the word that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 67,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          "triangle",
          "geometry",
          "mathematics"
        ],
        [
          "frog",
          "biology",
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-067-opt-E",
    "options": [
      {
        "id": "olsat-q-067-opt-A",
        "questionId": "olsat-q-067",
        "label": "A",
        "order": 0,
        "optionText": "zoology",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-067-opt-B",
        "questionId": "olsat-q-067",
        "label": "B",
        "order": 1,
        "optionText": "dissection",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-067-opt-C",
        "questionId": "olsat-q-067",
        "label": "C",
        "order": 2,
        "optionText": "laboratory",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-067-opt-D",
        "questionId": "olsat-q-067",
        "label": "D",
        "order": 3,
        "optionText": "experiment",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-067-opt-E",
        "questionId": "olsat-q-067",
        "label": "E",
        "order": 4,
        "optionText": "science",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-068",
    "questionNumber": 68,
    "questionText": "is to ... as ... is to —",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 68,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "e68b0fc9-800d-4156-890b-1fff4f4062ca",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-068-opt-J",
    "options": [
      {
        "id": "olsat-q-068-opt-F",
        "questionId": "olsat-q-068",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "805ecf72-4884-4144-813b-91d5b493f22c",
        "isCorrect": false
      },
      {
        "id": "olsat-q-068-opt-G",
        "questionId": "olsat-q-068",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "29817d4c-492b-4428-8ae7-ff4c8eac746b",
        "isCorrect": false
      },
      {
        "id": "olsat-q-068-opt-H",
        "questionId": "olsat-q-068",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "f3f933c1-c885-43f9-816e-85105de9395e",
        "isCorrect": false
      },
      {
        "id": "olsat-q-068-opt-J",
        "questionId": "olsat-q-068",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "f07a2554-cf72-43d5-8548-0266e03cdaf0",
        "isCorrect": true
      },
      {
        "id": "olsat-q-068-opt-K",
        "questionId": "olsat-q-068",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "8c61dd90-117b-40b0-89cd-914ea85e0e3f",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-069",
    "questionNumber": 69,
    "questionText": "The numbers in the box go together in a certain way. Choose the number that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 69,
    "stimulusType": "STRUCTURED",
    "stimulusMediaId": null,
    "structuredStimulus": {
      "type": "MATRIX",
      "rows": [
        [
          0,
          4,
          12
        ],
        [
          4,
          8,
          16
        ],
        [
          12,
          16,
          "?"
        ]
      ]
    },
    "structuredStimulusEmphasis": null,
    "correctAnswer": "C",
    "correctOptionId": "olsat-q-069-opt-C",
    "options": [
      {
        "id": "olsat-q-069-opt-A",
        "questionId": "olsat-q-069",
        "label": "A",
        "order": 0,
        "optionText": "18",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-069-opt-B",
        "questionId": "olsat-q-069",
        "label": "B",
        "order": 1,
        "optionText": "20",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-069-opt-C",
        "questionId": "olsat-q-069",
        "label": "C",
        "order": 2,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-069-opt-D",
        "questionId": "olsat-q-069",
        "label": "D",
        "order": 3,
        "optionText": "28",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-069-opt-E",
        "questionId": "olsat-q-069",
        "label": "E",
        "order": 4,
        "optionText": "32",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-070",
    "questionNumber": 70,
    "questionText": "The drawings in the first part of the row go together to form a series. In the next part of the row, choose the drawing that goes where you see the question mark.",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 70,
    "stimulusType": "IMAGE",
    "stimulusMediaId": "1c9a777a-1971-460f-8797-026be3b965a3",
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "F",
    "correctOptionId": "olsat-q-070-opt-F",
    "options": [
      {
        "id": "olsat-q-070-opt-F",
        "questionId": "olsat-q-070",
        "label": "F",
        "order": 0,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "0ccabffe-ea92-4449-8006-9d96122029ec",
        "isCorrect": true
      },
      {
        "id": "olsat-q-070-opt-G",
        "questionId": "olsat-q-070",
        "label": "G",
        "order": 1,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "031ff28b-e221-4bc0-8b8e-85d9da8f8266",
        "isCorrect": false
      },
      {
        "id": "olsat-q-070-opt-H",
        "questionId": "olsat-q-070",
        "label": "H",
        "order": 2,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "cdbc4ed5-0e96-4c03-8529-433f004da26e",
        "isCorrect": false
      },
      {
        "id": "olsat-q-070-opt-J",
        "questionId": "olsat-q-070",
        "label": "J",
        "order": 3,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "ab0cdb3e-2042-42c9-88d3-a8c53cc1fd57",
        "isCorrect": false
      },
      {
        "id": "olsat-q-070-opt-K",
        "questionId": "olsat-q-070",
        "label": "K",
        "order": 4,
        "optionText": null,
        "optionTextEmphasis": null,
        "mediaId": "b97578ae-488d-4daa-83e3-583c0c9edb75",
        "isCorrect": false
      }
    ]
  },
  {
    "id": "olsat-q-071",
    "questionNumber": 71,
    "questionText": "What number divided by three is equal to ten plus two?",
    "questionTextEmphasis": null,
    "type": "MULTIPLE_CHOICE",
    "order": 71,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "E",
    "correctOptionId": "olsat-q-071-opt-E",
    "options": [
      {
        "id": "olsat-q-071-opt-A",
        "questionId": "olsat-q-071",
        "label": "A",
        "order": 0,
        "optionText": "12",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-071-opt-B",
        "questionId": "olsat-q-071",
        "label": "B",
        "order": 1,
        "optionText": "13",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-071-opt-C",
        "questionId": "olsat-q-071",
        "label": "C",
        "order": 2,
        "optionText": "24",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-071-opt-D",
        "questionId": "olsat-q-071",
        "label": "D",
        "order": 3,
        "optionText": "30",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-071-opt-E",
        "questionId": "olsat-q-071",
        "label": "E",
        "order": 4,
        "optionText": "36",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      }
    ]
  },
  {
    "id": "olsat-q-072",
    "questionNumber": 72,
    "questionText": "Choose the words that best complete this sentence: Although Jamie’s grades were ______, her parents were ______.",
    "questionTextEmphasis": [
      {
        "start": 22,
        "end": 26,
        "style": "ITALIC"
      }
    ],
    "type": "MULTIPLE_CHOICE",
    "order": 72,
    "stimulusType": "NONE",
    "stimulusMediaId": null,
    "structuredStimulus": null,
    "structuredStimulusEmphasis": null,
    "correctAnswer": "J",
    "correctOptionId": "olsat-q-072-opt-J",
    "options": [
      {
        "id": "olsat-q-072-opt-F",
        "questionId": "olsat-q-072",
        "label": "F",
        "order": 0,
        "optionText": "excellent — delighted",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-072-opt-G",
        "questionId": "olsat-q-072",
        "label": "G",
        "order": 1,
        "optionText": "terrible — furious",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-072-opt-H",
        "questionId": "olsat-q-072",
        "label": "H",
        "order": 2,
        "optionText": "poor — dissatisfied",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      },
      {
        "id": "olsat-q-072-opt-J",
        "questionId": "olsat-q-072",
        "label": "J",
        "order": 3,
        "optionText": "acceptable — disappointed",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": true
      },
      {
        "id": "olsat-q-072-opt-K",
        "questionId": "olsat-q-072",
        "label": "K",
        "order": 4,
        "optionText": "superior — interested",
        "optionTextEmphasis": null,
        "mediaId": null,
        "isCorrect": false
      }
    ]
  }
];

export const APPLICANT_EXAM_ESSAY_QUESTION: ExamQuestion = {
  "id": "olsat-essay-073",
  "questionText": "Discuss how graduate research and evidence-based inquiry can address a pressing educational, administrative, or public service challenge in your current professional field. In your response, state the specific problem, propose a research-informed approach, and explain how your intended graduate program at EARIST will prepare you to lead this initiative.",
  "questionTextEmphasis": null,
  "type": "ESSAY",
  "order": 73,
  "stimulusType": "NONE",
  "stimulusMediaId": null,
  "structuredStimulus": null,
  "structuredStimulusEmphasis": null,
  "options": []
};

export const APPLICANT_EXAM_QUESTIONS: ExamQuestion[] = [
  ...APPLICANT_EXAM_MCQ_QUESTIONS.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    questionTextEmphasis: q.questionTextEmphasis,
    type: q.type as ExamQuestionType,
    order: q.order,
    stimulusType: q.stimulusType as ExamStimulusType,
    stimulusMediaId: q.stimulusMediaId,
    structuredStimulus: q.structuredStimulus as StructuredStimulus | null,
    structuredStimulusEmphasis: q.structuredStimulusEmphasis as StructuredStimulusEmphasis,
    options: q.options.map((opt): ExamOption => ({
      id: opt.id,
      questionId: opt.questionId,
      label: opt.label,
      order: opt.order,
      optionText: opt.optionText,
      optionTextEmphasis: opt.optionTextEmphasis as TextEmphasisSpan[] | null,
      mediaId: opt.mediaId,
    })),
  })),
  APPLICANT_EXAM_ESSAY_QUESTION,
];

export const SAMPLE_APPLICANT_ESSAY_RESPONSE = [
  "Graduate research has reshaped how I approach school administration and instructional supervision. Rather than relying solely on routine compliance, I frame recurring instructional gaps as empirical questions, gather classroom-level evidence before introducing interventions, and treat initial assumptions as hypotheses to be tested collaboratively with teachers.",
  "In our division, one pressing challenge is improving instructional coaching consistency across grade levels while reducing administrative reporting burdens on master teachers. Through the Master of Arts in Education major in Administration and Supervision at EARIST, I aim to design and evaluate a structured, data-informed supervisory toolkit that aligns classroom observation feedback with targeted professional learning communities.",
  "Engaging with graduate research methodologies and policy analysis at EARIST will equip me with rigorous mixed-methods evaluation skills to measure whether supervisory interventions genuinely improve teacher efficacy and learner outcomes.",
].join("\n\n");
