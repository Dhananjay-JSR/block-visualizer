import { createContext, useReducer } from "react";


 const inititlaSTate:{
    blackList: string[];
    whiteList: string[];
    deletedNode: string[];
    detachedNode: string[];
    extenderNode: {
        nodeId: string;
        XPosition: number;
        YPosition: number;
    }
} = {
    blackList : [],
    whiteList: [],
    deletedNode: [],
    detachedNode: [],
    extenderNode: {
        nodeId: "",
        XPosition: 0,
        YPosition: 0
    }
}


export enum ActionType {
    ADD_BLACKLIST,
    ADD_WHITELIST,
    REMOVE_BLACKLIST,
    REMOVE_WHITELIST,
    ADD_DELETEDNODE,
    ADD_DETACHEDNODE,
    ADD_EXTENDERNODE,
    REMOVE_EXTENDERNODE
}


 function Action(state: typeof inititlaSTate, action: any) {
 switch (action.type) {
        case ActionType.ADD_BLACKLIST:
            return {
                ...state,
                blackList: [...state.blackList, action.payload]
            }
            case ActionType.ADD_WHITELIST:
                return {
                    ...state,
                    whiteList: [...state.whiteList, action.payload]
                }
            case ActionType.REMOVE_BLACKLIST:
                return {
                    ...state,
                    blackList: state.blackList.filter((item) => item !== action.payload)
                }
            case ActionType.REMOVE_WHITELIST:
                return {
                    ...state,
                    whiteList: state.whiteList.filter((item) => item !== action.payload)
                }
                case ActionType.ADD_DELETEDNODE:
                    return {
                        ...state,
                        deletedNode: [...state.deletedNode, action.payload]
                    }
                case ActionType.ADD_DETACHEDNODE:
                    return {
                        ...state,
                        detachedNode: [...state.detachedNode, action.payload]
                    }
                case ActionType.ADD_EXTENDERNODE:
                    return {
                        ...state,
                        extenderNode: action.payload
                    }
                case ActionType.REMOVE_EXTENDERNODE:
                    return {
                        ...state,
                        extenderNode: {
                            nodeId: "",
                            XPosition: 0,
                            YPosition: 0
                        }
                    }
                default:
                    return state;
    }

}





export const ContainerProvider = createContext<{
    state: typeof inititlaSTate;
    dispatch: React.Dispatch<any>
}| null>(null);


export function ContainerContext({children}:{children:React.ReactNode}){
    const [InitSTate, dispatch] = useReducer(Action, inititlaSTate); 
    return <>
    <ContainerProvider.Provider value={{
        state:InitSTate,
        dispatch:dispatch
    }} >
        {children}
    </ContainerProvider.Provider>
    
    </>
}