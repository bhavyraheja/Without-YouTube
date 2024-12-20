import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import { auth } from "@clerk/nextjs/server";



export async function POST(
    req: Request,
){
    try{
        const  { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 }); // Use 401 for unauthorized.
        }
        const {title} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status:404});
        }

        const course = await db.course.create({
            data:{
                userId,
                title,
            }
        });

        return NextResponse.json(course);

    }catch(error){
        console.log("[COURSES]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}