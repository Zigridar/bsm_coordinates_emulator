import {useState} from 'react'

export const useHttp = () => {

    const [isLoading, setLoading] = useState<boolean>(false)

    const request = async (url: string, method: string = 'GET', body: any = null, headers: {[key:string]: string} = {}) => {
        setLoading(() => true)

        /** if body exists **/
        if (body) {
            body = JSON.stringify(body)
            headers['Content-Type'] = 'application/json'
        }

        try {
            const res = await fetch(url, {
                method,
                body,
                headers
            })

            return await res.json()
        }
        catch (e) {
            console.error(e)
            throw e
        }
        finally {
            setLoading(() => false)
        }
    }

    return { isLoading, request }
}