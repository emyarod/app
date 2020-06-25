import s from './index.module.css'
import React from 'react'

export default ({ className, children })=>(
    <div className={s.page + ' ' + className}>
        {children}
    </div>
)