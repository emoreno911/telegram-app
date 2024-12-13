import { NextResponse } from "next/server";
import axios from "axios";

async function trackList({ id }) {
  try {
    const { data, status } = await axios.get(
      `https://api.deezer.com/radio/${id}/tracks`
    );
    return {
      error: false,
      status,
      data: data.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 0,
      error: true,
      data: null,
    };
  }
}

export async function POST(req) {
  const data = await req.json();
  const result = await trackList(data);
  return NextResponse.json(result);
}
