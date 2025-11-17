import React, { useState, useEffect } from 'react'
import '../styles/components/Loader.css'

export default function Loader() {

    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('Loading info')

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setStatus('')
                    clearInterval(timer)
                    return 100
                }
                return prev + 1
            })
        }, 50)

        return () => clearInterval(timer)


    }, [])

    return (
        <div className='loader-wrapper'>
            <div className='loader-container'>
                <h2>{status}...</h2> 
                <div className='progress'> 
                    <div className='progress-bar' style={{ width: progress + '%' }}></div> 
                </div> 
                <div className='percent'>{progress}%</div> 
            </div> 
        </div>
    )
}