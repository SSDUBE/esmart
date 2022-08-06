export * from './Routes';

interface ILeaderBoard {
  name: string;
  status:
    | 'totalStudent'
    | 'totalTeachers'
    | 'totalGames'
    | 'totalSchools'
    | 'suspendedStudents';
}

export const LeaderBoardStatus: ILeaderBoard[] = [
  { name: 'Total Students', status: 'totalStudent' },
  { name: 'Total Teachers', status: 'totalTeachers' },
  { name: 'Total Games', status: 'totalGames' },
  { name: 'Total Schools', status: 'totalSchools' },
  { name: 'Suspendend Students', status: 'suspendedStudents' },
];
