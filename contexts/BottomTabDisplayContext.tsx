import React , { createContext, PropsWithChildren, useContext, useState } from "react";


interface IBottomTabDisplayProp{
    show: () => void;
    hide: () => void;
    isBottomTabVisible: boolean
}

export const BottomTabDisplayContext = createContext<IBottomTabDisplayProp>({show: () => {}, hide: () => {}, isBottomTabVisible: true})


const BottomTabDisplayProvider = ({children}: PropsWithChildren) => {
    const [showTab, setShowTab] = useState<boolean>(true)
    const showBottomTab = () => {
        setShowTab(true)
    }

    const hideBottomTab = () => {
        setShowTab(false)
    }

    return (
        <BottomTabDisplayContext.Provider
            value={{
                show: showBottomTab,
                hide: hideBottomTab,
                isBottomTabVisible: showTab
            }}
        >
            {children}
        </BottomTabDisplayContext.Provider>
    )
}

export const useBottomTabDisplay = () =>  useContext(BottomTabDisplayContext)

export default BottomTabDisplayProvider