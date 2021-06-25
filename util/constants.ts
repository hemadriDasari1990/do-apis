export const UNAUTHORIZED = "UNAUTHORIZED";
export const REQUIRED = "REQUIRED";
export const NOT_FOUND = "NOT_FOUND";
export const TOKEN_EXPIRED = "TOKEN_EXPIRED";
export const ALREADY_VERIFIED = "ALREADY_VERIFIED";
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
export const VERIFIED = "VERIFIED";
export const RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS";
export const TOKEN_MISSING = "TOKEN_MISSING";
export const USER_ALREADY_EXIST = "USER_ALREADY_EXIST";
export const EMAIL_VERIFIED = "EMAIL_VERIFIED";
export const USER_NOT_FOUND = "USER_NOT_FOUND";
export const INCORRECT_PASSWORD = "INCORRECT_PASSWORD";
export const ANSWER_NOT_MATCHING = "ANSWER_NOT_MATCHING";
export const PASSWORDS_ARE_SAME = "PASSWORDS_ARE_SAME";
export const PASSWORDS_ARE_NOT_SAME = "PASSWORDS_ARE_NOT_SAME";
export const RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
export const VALIDATION_FAILED = "VALIDATION_FAILED";
export const CREATION_FAILED = "CREATION_FAILED";

export const MAX_TEAM_ERROR = "MAX_TEAM_ERROR";
export const MAX_TEAM_COUNT = 1000;

export const MAX_MEMBER_ERROR = "MAX_MEMBER_ERROR";
export const MAX_MEMBER_COUNT = 1000;

export const MAX_PROJECTS_ERROR = "MAX_PROJECTS_ERROR";
export const MAX_PROJECTS_COUNT = 1000;

export const MAX_SECTIONS_ERROR = "MAX_SECTIONS_ERROR";
export const MAX_SECTIONS_COUNT = 10;

export const INVALID_REQUEST = "INVALID_REQUEST";

export const MAX_BOARDS_ERROR = "MAX_BOARDS_ERROR";
export const MAX_BOARDS_COUNT = 1000;

export const VERIFY_TOKEN_EXPIRY = "2d";
export const JOIN_TOKEN_EXPIRY = "2d";

export const defaultSectionList: Array<{ [Key: string]: any }> = [
  {
    name: "What Went Well, What Didn't Go Well, Action Items",
  },
  {
    name: "Mad, Sad, Glad",
  },
  {
    name: "Start, Stop, Continue",
  },
  {
    name: "Went Well, To Improve, Action Items",
  },
  {
    name: "To Dicuss, Discussing, Discussed",
  },
  {
    name: "Liked, Learned, Lacked, Longed For",
  },
  {
    name: "Keep, Add, Less, More",
  },
  {
    name: "Drop, Add, Keep, Improve",
  },
  {
    name: "Strengths, Weaknesses, Opportunities, Threats",
  },
  {
    name: "Explorer, Shopper, Vacationer, Prisoner",
  },
  {
    name: "Mistakes, Experiments, Practices, Learnings",
  },
  {
    name: "We Do, We Value",
  },
  {
    name: "Love, Want, Hate, Learn",
  },
  {
    name: "Good, Bad, Better, Best",
  },
  {
    name: "Key Results, Initiatives, Objectives",
  },
  {
    name: "Happy, Meh, Sad",
  },
  {
    name: "Rose, Bud, Thorn",
  },
  {
    name: "Hopes, Fears",
  },
  {
    name: "Keep Doing, Start Doing, Stop Doing, Less of, More of, Action Items",
  },
];

export const defaultSecurityQuestions: Array<{ [Key: string]: any }> = [
  {
    name: "What is your favourite color?",
  },
  {
    name: "What is your favourite city?",
  },
  {
    name: "What is your favourite country",
  },
];
