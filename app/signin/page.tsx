"use client"
import React from 'react'
import { signIn } from 'next-auth/react'

const page = () => {
    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={() => {
                signIn("google", { callbackUrl: "/dashboard" })
            }}>
                Signin with Google
            </button>
        </div>
    )
}

export default page