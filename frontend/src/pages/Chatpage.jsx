import { ChatState } from '../context/ChatProvider.jsx'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../component/misc/SideDrawer.jsx'
import MyChats from '../component/misc/MyChats.jsx'
import { useState } from 'react'
import ChatBox from '../component/misc/ChatBox.jsx'
const Chatpage = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false);

    return <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
            {user && (
                <MyChats fetchAgain={fetchAgain} />)}
            {user && (
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
        </Box>
    </div>

}

export default Chatpage
