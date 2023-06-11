import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  AnimationDefinition,
  motion,
  MotionProps,
  useAnimate,
  useAnimationControls,
} from 'framer-motion'
import styles from '@styles/modules/introLoading.module.scss'
import Image from 'next/image'
import { Loading } from 'kaidohussar-ui'

type Props = {
  children: React.ReactElement
  isLoadingPage: boolean
}

type ColumnImages = (string | 'content')[]

const COLUMN1_IMAGES: ColumnImages = [
  '/intro-images/boat.webp',
  '/intro-images/boat.webp',
  '/intro-images/boat.webp',
  '/intro-images/boat.webp',
]
const COLUMN2_IMAGES: ColumnImages = [
  '/intro-images/stairs.webp',
  '/intro-images/stairs.webp',
  '/intro-images/stairs.webp',
  '/intro-images/stairs.webp',
]
const COLUMN3_IMAGES: ColumnImages = [
  '/intro-images/vase.webp',
  'content',
  '/intro-images/vase.webp',
]
const COLUMN4_IMAGES: ColumnImages = [
  '/intro-images/vase2.webp',
  '/intro-images/vase2.webp',
  '/intro-images/vase2.webp',
  '/intro-images/vase2.webp',
]
const COLUMN5_IMAGES: ColumnImages = [
  '/intro-images/image.webp',
  '/intro-images/image.webp',
  '/intro-images/image.webp',
  '/intro-images/image.webp',
]

const COLUMNS = [
  COLUMN1_IMAGES,
  COLUMN2_IMAGES,
  COLUMN3_IMAGES,
  COLUMN4_IMAGES,
  COLUMN5_IMAGES,
]

const IMG_TOTAL_COUNT =
  COLUMN1_IMAGES.length +
  COLUMN2_IMAGES.length +
  COLUMN3_IMAGES.length +
  COLUMN4_IMAGES.length +
  COLUMN5_IMAGES.length

const COLUMN_DELAY_MAP_1 = [4, 3, 2, 1]
const COLUMN_DELAY_MAP_2 = [0.5, 2, 3.5, 4.6]
const COLUMN_DELAY_MAP_CONTENT = [3, 2, 1.5]

const MOVE_PERCENTAGE_FROM_BOTTOM = {
  0: 0.75,
  1: 0.5,
  2: 0.25,
  3: 0,
}

const MOVE_PERCENTAGE_FROM_TOP = {
  0: 0,
  1: 0.25,
  2: 0.5,
  3: 0.75,
}

const MOVE_PERCENTAGE_FROM_BOTTOM_CONTENT_COLUMN = {
  0: 0.15,
  1: 0.4,
  2: 0.65,
}

const CONTENT_COLUMN_IDX = 2

const IntroLoading = ({ children, isLoadingPage }: Props) => {
  const [imagesWrapperScope, animateImagesWrapperInit] = useAnimate()

  const imageAnimationControls = useAnimationControls()
  const contentAnimationControls = useAnimationControls()

  const initialLoadingPercentage = 100 / IMG_TOTAL_COUNT
  const [loadingPercentage, setLoadingPercentage] = useState(
    initialLoadingPercentage,
  )

  const handleImageLoaded = () => {
    setLoadingPercentage((prevState) => {
      return prevState + 100 / IMG_TOTAL_COUNT
    })
  }

  const imagesLoaded = Math.round(loadingPercentage) === 100

  const getVerticalMovePx = (
    dir: 'top' | 'bot',
    isContentColumn: boolean,
    imageIdx,
  ) => {
    if (isContentColumn) {
      console.log('imageIdx', imageIdx)
      return (
        document.body.offsetHeight *
        -1 *
        MOVE_PERCENTAGE_FROM_BOTTOM_CONTENT_COLUMN[imageIdx]
      )
    }

    return dir === 'top'
      ? document.body.offsetHeight * -1 * MOVE_PERCENTAGE_FROM_TOP[imageIdx]
      : document.body.offsetHeight * MOVE_PERCENTAGE_FROM_BOTTOM[imageIdx]
  }

  const getImageAnimation = useCallback(
    (dir: 'top' | 'bot', isContentColumn, imageIdx) => {
      const modifier = 0.7

      let delay =
        dir === 'top'
          ? COLUMN_DELAY_MAP_1[imageIdx] * modifier
          : COLUMN_DELAY_MAP_2[imageIdx] * modifier

      if (isContentColumn) {
        delay = COLUMN_DELAY_MAP_CONTENT[imageIdx] * modifier
      }

      const animation: AnimationDefinition = {
        opacity: 1,
        y: getVerticalMovePx(dir, isContentColumn, imageIdx),
        transition: {
          duration: 1,
          delay,
          opacity: {
            duration: 0.6,
          },
          y: {
            duration: 2.5, // Total duration of the animation
            ease: [0.4, 0.0, 0.2, 1],
          },
        },
      }

      return animation
    },
    [],
  )

  const animateImagesWrapper = useCallback(async () => {
    await animateImagesWrapperInit(
      imagesWrapperScope.current,
      { scale: 3.5 },
      {
        duration: 3,
        delay: 3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    )
    await animateImagesWrapperInit(
      imagesWrapperScope.current,
      { opacity: 0 },
      {
        duration: 0.3,
      },
    )
  }, [animateImagesWrapperInit, imagesWrapperScope])

  useEffect(() => {
    const handleIntroAnimations = async () => {
      await imageAnimationControls.start(({ dir, isContentColumn, index }) =>
        getImageAnimation(dir, isContentColumn, index),
      )
      contentAnimationControls.start(() => ({
        opacity: 1,
        transition: {
          duration: 0.2,
        },
      }))
      contentAnimationControls.start(() => ({
        //  scale: 1,
        transition: {
          duration: 3,
          ease: [0.4, 0.0, 0.2, 1],
        },
      }))
    }

    if (imagesLoaded) {
      animateImagesWrapper()
      handleIntroAnimations().then(() => console.log('animations finished'))
    }
  }, [
    animateImagesWrapper,
    contentAnimationControls,
    getImageAnimation,
    imageAnimationControls,
    imagesLoaded,
  ])

  if (isLoadingPage && loadingPercentage === initialLoadingPercentage) {
    return <Loading />
  }

  return (
    <AnimatePresence>
      {!imagesLoaded && (
        <motion.div
          key="loader"
          className={styles.percentageLoader}
          initial={{ opacity: 1 }}
          animate={imagesLoaded && { opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.6, delay: 0.3 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.percentageTextWrapper}>
            <motion.div
              key="loader"
              initial={{ y: 0, opacity: 1 }}
              animate={imagesLoaded && { y: -20, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
              exit={{ y: -30, opacity: 0 }}
            >
              {`${Math.round(loadingPercentage)}%`}
            </motion.div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 1.1 }}
        key="images-root"
        className={styles.root}
        ref={imagesWrapperScope}
      >
        {COLUMNS.map((columnImages, columnIndex) => {
          const animatingFromBotToTop = columnIndex % 2 === 0

          return (
            <motion.div key={columnIndex}>
              {columnImages.map((img, imageIndex) => {
                const initialAnimState = {
                  opacity: 0,
                  y: animatingFromBotToTop ? '100%' : '-100%',
                }

                if (img === 'content') {
                  return (
                    <motion.div
                      key="content"
                      custom={{
                        dir: 'top',
                        isContentColumn: true,
                        index: imageIndex,
                      }}
                      className={styles.contentDisplayIntro}
                      initial={initialAnimState}
                      animate={imageAnimationControls}
                    >
                      <motion.div
                        initial={{
                          scale: 0.2,
                        }}
                        style={{
                          pointerEvents: 'none',
                        }}
                        layout
                      >
                        {children}
                      </motion.div>
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={`${img}-${imageIndex}`}
                    initial={initialAnimState}
                    custom={{
                      dir: animatingFromBotToTop ? 'top' : 'bot',
                      isContentColumn: columnIndex === CONTENT_COLUMN_IDX,
                      index: imageIndex,
                    }}
                    animate={imageAnimationControls}
                  >
                    <Image
                      layout="fill"
                      priority
                      src={img}
                      alt={`intro-image-column-${columnIndex}-image-${imageIndex}`}
                      onLoadingComplete={handleImageLoaded}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          )
        })}
      </motion.div>
      <div className={styles.contentDisplay}>
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
            pointerEvents: 'none',
          }}
          animate={contentAnimationControls}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default IntroLoading
