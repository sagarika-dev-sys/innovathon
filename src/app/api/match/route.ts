import { NextResponse } from 'next/server';
import { generateTeam } from '@/lib/matchingAlgorithm';
import { studentsData } from '@/data/students';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requiredSkills, teamSize = 3, pool } = body;

    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return NextResponse.json(
        { error: 'requiredSkills must be a non-empty array of strings.' },
        { status: 400 }
      );
    }

    const size = parseInt(teamSize, 10);
    if (isNaN(size) || size < 1) {
      return NextResponse.json(
        { error: 'teamSize must be an integer >= 1.' },
        { status: 400 }
      );
    }

    const studentPool = Array.isArray(pool) && pool.length > 0 ? pool : studentsData;
    const result = generateTeam(studentPool, requiredSkills, size);

    return NextResponse.json({
      success: true,
      result,
      meta: {
        totalEvaluatedStudents: studentPool.length,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Matching Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/match',
    totalRegisteredPeers: studentsData.length,
    description: 'Post JSON body: { requiredSkills: string[], teamSize: number }'
  });
}
