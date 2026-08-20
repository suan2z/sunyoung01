import type { Exercise } from '../types'

export const seedExercises: Exercise[] = [
  { id: 'squat', name: '스쿼트', bodyParts: ['허벅지', '엉덩이'], painTags: ['무릎'], intensity: 'high', space: ['home', 'gym'], defaultSets: 4, defaultRepsOrTime: '15회', secondsPerSet: 40 },
  { id: 'lunge', name: '런지', bodyParts: ['허벅지', '엉덩이'], painTags: ['무릎'], intensity: 'medium', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '12회 x 양쪽', secondsPerSet: 45 },
  { id: 'pushup', name: '푸쉬업', bodyParts: ['팔뚝', '전신'], painTags: ['손목', '어깨'], intensity: 'medium', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '12회', secondsPerSet: 30 },
  { id: 'plank', name: '플랭크', bodyParts: ['복부'], painTags: ['손목', '허리'], intensity: 'medium', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '40초', secondsPerSet: 40 },
  { id: 'crunch', name: '크런치', bodyParts: ['복부'], painTags: ['허리'], intensity: 'low', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '20회', secondsPerSet: 30 },
  { id: 'burpee', name: '슬로우 버피', bodyParts: ['전신'], painTags: ['무릎', '어깨', '손목'], intensity: 'high', space: ['home', 'gym'], defaultSets: 4, defaultRepsOrTime: '10회', secondsPerSet: 40 },
  { id: 'deadlift', name: '데드리프트', bodyParts: ['등', '엉덩이', '허벅지'], painTags: ['허리', '무릎'], intensity: 'high', space: ['gym'], defaultSets: 4, defaultRepsOrTime: '10회', secondsPerSet: 45 },
  { id: 'bench-press', name: '벤치프레스', bodyParts: ['팔뚝', '전신'], painTags: ['어깨', '손목'], intensity: 'high', space: ['gym'], defaultSets: 4, defaultRepsOrTime: '10회', secondsPerSet: 45 },
  { id: 'hip-thrust', name: '힙쓰러스트', bodyParts: ['엉덩이'], painTags: ['허리'], intensity: 'medium', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '15회', secondsPerSet: 40 },
  { id: 'jumping-jack', name: '제자리 뛰기', bodyParts: ['전신'], painTags: ['무릎', '발목'], intensity: 'medium', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '40초', secondsPerSet: 40 },
  { id: 'shoulder-press', name: '숄더프레스', bodyParts: ['팔뚝'], painTags: ['어깨', '손목'], intensity: 'medium', space: ['gym'], defaultSets: 3, defaultRepsOrTime: '12회', secondsPerSet: 35 },
  { id: 'stretch-neck', name: '목 스트레칭', bodyParts: ['전신'], painTags: [], intensity: 'low', space: ['home', 'gym'], defaultSets: 1, defaultRepsOrTime: '2분', secondsPerSet: 120, isRecovery: true },
  { id: 'foam-roller', name: '폼롤러 스트레칭', bodyParts: ['전신'], painTags: [], intensity: 'low', space: ['home', 'gym'], defaultSets: 1, defaultRepsOrTime: '5분', secondsPerSet: 300, isRecovery: true },
  { id: 'recovery-yoga', name: '회복 요가', bodyParts: ['전신'], painTags: [], intensity: 'low', space: ['home', 'gym'], defaultSets: 1, defaultRepsOrTime: '10분', secondsPerSet: 600, isRecovery: true },
  { id: 'seated-stretch', name: '누워서 하는 스트레칭', bodyParts: ['전신'], painTags: [], intensity: 'low', space: ['home', 'gym'], defaultSets: 1, defaultRepsOrTime: '5분', secondsPerSet: 300, isRecovery: true },
  { id: 'upper-body-band', name: '밴드 상체 운동', bodyParts: ['팔뚝', '등'], painTags: ['손목'], intensity: 'low', space: ['home', 'gym'], defaultSets: 3, defaultRepsOrTime: '15회', secondsPerSet: 35 },
]

export const recoveryPool = seedExercises.filter((e) => e.isRecovery)
