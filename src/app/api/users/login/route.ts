import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/helpers/mailer";


connect()

export async function POST(request: NextRequest) {
    try {

        // Add CORS headers
        const responseHeaders = new Headers({
            'Access-Control-Allow-Origin': 'http://localhost:3000', // Adjust this for your frontend
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });

        // Handle preflight request (OPTIONS method)
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { headers: responseHeaders, status: 204 });
        }
        
        const reqBody = await request.json();
        const { email, password } = reqBody;

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User does not exist", success: false }, { status: 200 })
        }

        if (!user.isVerified) {
            await sendEmail({ email, emailType: "VERIFY", userId: user._id })
            return NextResponse.json({ message: "User not verified", success: false }, { status: 200 });
        }

        //check if the password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {

            return NextResponse.json({ message: "Password is incorrect", success: false }, { status: 200 })
        }
        //create a token data 
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        //create a token
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, { expiresIn: "1d" })

        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
        }, { status: 200 })

        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}