import React from 'react'
import clsx from 'clsx'
import { BadgeType } from '@/types'

function Badge({ title, icon: Icon, className, ...props }: BadgeType) {
    return (
        <div className={clsx("inline-flex items-center gap-2 border border-white/20",
            "bg-gradient-to-tr from-[#0a0a0f] via-[#111827] to-[#0f172a]",
            "backdrop-blur-2xl rounded-full px-4 py-2 shadow-lg",
            "hover:shadow-white/10 transition-all duration-500 hover:scale-105", className)}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4 text-stone-200" />}
            {title && (
                <span className="text-xs text-stone-100 font-medium">{title}</span>
            )}
        </div >
    )
}

export default Badge