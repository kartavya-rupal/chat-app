import React from 'react'
import { Button } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Box, Text } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import ChatLoading from './ChatLoading'
import { Spinner } from '@chakra-ui/react'
import  NotificationBadge  from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import { getSender } from '../../config/ChatLogics'
import UserListItem from '../userAvatar/UserListItem'
import ProfileModal from './ProfileModal'
import { ChatState } from '../../context/ChatProvider'
import debounce from "lodash.debounce"

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState()

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
    toast({
      title: "Logout Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    })
  }

  const handleSearch = async () => {

    if (!search) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const debouncedSearch = debounce(handleSearch, 500)
  useEffect(() => {
    debouncedSearch()
    return () => {
      debouncedSearch.cancel()
    }
  }, [search])

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" backgroundColor="#edf2f7" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          VibeTalk
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}>
                  {notif.chat.isGroupChat ? (
                    `New Message in ${notif.chat.chatName}`
                  ) : (
                    `New Message from ${getSender(user, notif.chat.users)}`
                  )}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.avatar} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <Button onClick={handleSearch}>Go</Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner size="lg" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer
