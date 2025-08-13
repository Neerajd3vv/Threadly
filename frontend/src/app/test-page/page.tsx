"use client"
import React from 'react'
import { useSession } from 'next-auth/react'

function Page() {
    const { data: session } = useSession()
    return (
        <div>
            LOGGED IN....
            <div>{JSON.stringify(session)}</div>
        </div>
    )
}

export default Page