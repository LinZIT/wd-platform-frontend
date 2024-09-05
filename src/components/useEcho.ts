import { useEffect, useState } from 'react'
import Echo from 'laravel-echo'

import Pusher from 'pusher-js'
import { axios } from '../lib/axios'
window.Pusher = Pusher

const useEcho = () => {
    const [echoInstance, setEchoInstance] = useState<any>(null)

    useEffect(() => {
        // We are going to create the Echo instance here...\
        try {
            const echo = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY,
                authorizer: (channel: any) => {
                    return {
                        authorize: (socketId: any, callback: any) => {
                            // console.log({ socketId })
                            axios
                                .post('/api/broadcasting/auth', {
                                    socket_id: socketId,
                                    channel_name: channel.name,
                                })
                                .then((response: any) => {
                                    callback(false, response.data)
                                })
                                .catch((error: any) => {
                                    callback(true, error)
                                })
                        },
                    }
                },
                wsHost: import.meta.env.VITE_REVERB_HOST,
                wsPort: import.meta.env.VITE_REVERB_PORT,
                wssPort: import.meta.env.VITE_REVERB_PORT,
                forceTLS:
                    (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
                enabledTransports: ['ws', 'wss'],
            })
            setEchoInstance(echo)
        } catch (error) {
            console.log({ error })
        }

    }, [])

    return echoInstance
}

export default useEcho