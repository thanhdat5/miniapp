import { Button } from '@/components'
import { telegramInitDataRawToObject } from '@/utils'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { Modal, Placeholder, Spinner } from '@telegram-apps/telegram-ui'
import { useEffect, useState, type FC } from 'react'

// Define UserInfo
export interface UserInfo {
  name: string
  username: string
  referId: string
  isPremium: boolean
}

// Define endpoints
const API_URL = 'https://miniapp.kingdoms.game/api'
const API_GET_INFO = `${API_URL}/user/me`
const API_REGISTER = `${API_URL}/user/create-account`
const API_PLAY = `${API_URL}/user/increase-point`

export const IndexPage: FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
  const [error, setError] = useState('')

  // Get Telegram init raw data
  const { initDataRaw } = retrieveLaunchParams()
  const tma = `${initDataRaw}`
  const teleUser = telegramInitDataRawToObject(initDataRaw ?? '')
  console.log(teleUser)

  // Define header config
  const headerConfig: Partial<RequestInit> = {
    headers: {
      Authorization: `bearer ${tma}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Function to call api to create new account
   */
  const createNewAccount = async () => {
    // Convert data from Telegram to user account
    const appUser = {
      name: teleUser.name,
      username: teleUser.username,
      referId: teleUser.referId,
      isPremium: teleUser.isPremium
    }

    // Call api to create new account
    const response = await fetch(API_REGISTER, {
      method: 'POST',
      ...headerConfig,
      body: JSON.stringify(appUser)
    })

    // Return account info
    // TODO
    return response
  }

  useEffect(() => {
    async function initPage() {
      // Call api get user info
      fetch(API_GET_INFO, {
        method: 'GET',
        ...headerConfig
      })
        .then(async (res) => {
          // Create new account
          console.log(res)
          if (res.status === 403) {
            await createNewAccount()
            // TODO
            return
          }

          // Set user info
          if (res.status === 200) {
            const userData = await res.json()
            if (!userData.data) {
              await createNewAccount()
            } else {
              setUserInfo(userData as UserInfo)
            }
          }

          // Other case
          // TODO
        })
        .catch((err) => {
          console.log(err)
          // TODO
          setError(err.toString())
        })
    }

    initPage()
  }, [])

  /**
   * Handle click button play
   */
  const handleClick = async () => {
    const res = await fetch(API_PLAY, {
      method: 'PUT',
      ...headerConfig
    })
    console.log(res)
  }

  /**
   * Handle modal open change
   * @param open is modal open?
   */
  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setError('')
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        gap: '20px'
      }}
    >
      {/* Loading */}
      {!userInfo ? <Spinner size='l' /> : <></>}

      {/* Play game */}
      <Button disabled={!userInfo} variant='warning' onClick={handleClick}>
        Play to Airdrop
      </Button>

      {/* User info */}
      {JSON.stringify(userInfo)}

      {/* Error message */}
      <Modal open={error !== ''} onOpenChange={handleModalOpenChange}>
        <Placeholder description={error} header='Error'>
          <img
            alt='Telegram sticker'
            src='https://xelene.me/telegram.gif'
            style={{
              display: 'block',
              height: '144px',
              width: '144px'
            }}
          />
        </Placeholder>
      </Modal>
    </div>
  )
}
