import {Dialog} from '@headlessui/react'
import {motion} from 'framer-motion'
import {useRouter} from 'next/router'
import {useRef, useState, useEffect} from 'react'
import useKeypress from 'react-use-keypress'
import type {ImageProps} from '../utils/types'
import SharedModal from './SharedModal'
import {use} from "ast-types";

export default function Modal({images, onClose,}: {
    images: ImageProps[]
    onClose?: () => void
}) {
    let overlayRef = useRef()
    const router = useRouter()

    const {photoId} = router.query

    let index = Number(photoId)
    const timeDuration = 5000;
    const [direction, setDirection] = useState(0)
    const [curIndex, setCurIndex] = useState(index)
    const [countdown, setCountdown] = useState(5);


    function handleClose() {
        router.push('/', undefined, {shallow: true})
        onClose()
    }

    function changePhotoId(newVal: number) {
        if (newVal > index) {
            setDirection(1)
        } else {
            setDirection(-1)
        }
        setCurIndex(newVal)
        router.push(
            {
                query: {photoId: newVal},
            },
            `/p/${newVal}`,
            {shallow: true}
        )
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (index + 1 < images.length) {
                changePhotoId(index + 1);
            } else {
                changePhotoId(0);
            }
            setCountdown(5); // reiniciar el contador cada vez que cambie la imagen
        }, timeDuration);

        return () => clearInterval(interval);
    }, [index, images, timeDuration]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            } else {
                setCountdown(5); // reiniciar el contador cada vez que cambie la imagen
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);


    useKeypress('ArrowRight', () => {
        if (index + 1 < images.length) {
            changePhotoId(index + 1)
        }
    })


    useKeypress('ArrowLeft', () => {
        if (index > 0) {
            changePhotoId(index - 1)
        }
    })

    return (
        <Dialog
            static
            open={true}
            onClose={handleClose}
            initialFocus={overlayRef}
            className="fixed inset-0 z-10 flex items-center justify-center"
        >
            <Dialog.Overlay
                ref={overlayRef}
                as={motion.div}
                key="backdrop"
                className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
            />
            <SharedModal
                index={curIndex}
                direction={direction}
                images={images}
                changePhotoId={changePhotoId}
                closeModal={handleClose}
                navigation={true}
                timeDuration={5000}
                countdown={countdown}
            />
        </Dialog>
    )
}
