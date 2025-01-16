import React from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, IconButton, Text, Image } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader fontSize='40px' fontFamily='Work sans' display='flex' justifyContent='center'>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center' justifyContent='space-between'>
                        <Image src={user.avatar} alt={user.name} borderRadius='full' boxSize='150px'/>
                        <Text fontSize={{ base: '28px', md: '30px' }} fontFamily='Work sans'>{user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
