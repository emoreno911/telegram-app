import axios from "axios";
import { NextResponse } from "next/server";

async function radio() {
  try {
    const { data, status } = await axios.get(`https://api.deezer.com/radio`);
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
  const result = await radio(data);
  return NextResponse.json(result);
}
