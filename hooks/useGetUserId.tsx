import { useEffect, useState } from "react"
import { getUserId } from "../services/storage"
import { getUniqueId } from "react-native-device-info"


export const useGetUserId = () => {
    const [userId, setUserId] = useState<string | null>(null)

    const getId = async () => {
        const id =  getUserId() ||  await getUniqueId()
        setUserId(id)
    }

    useEffect(() => {getId()}, [])

    return {
        userId
    }
}