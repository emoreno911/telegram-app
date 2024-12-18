import { NextResponse } from "next/server";
import axios from "axios";

async function getTrack({ id }) {
  try {
    const { data, status } = await axios.get(
      `https://api.deezer.com/track/${id}`
    );
    return {
      error: false,
      status,
      data: data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      error: true,
      data: null,
    };
  }
}

export async function POST(req) {
  const data = await req.json();
  const result = await getTrack(data);
  return NextResponse.json(result);
}
