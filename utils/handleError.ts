import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/Error";
import { NextResponse } from "next/server";

export function handleError(error: Error) {
  console.error(error);
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof BadRequestError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
