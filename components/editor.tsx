import { Tldraw, defaultShapeUtils, createTLStore, throttle } from '@tldraw/tldraw'
import { useLayoutEffect, useState, useEffect } from 'react'
import { BookmarkIcon, AdjustmentsHorizontalIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
import { new_vision } from '../utils/default-vision'

export default function Editor({ showError }) {
  const { data: session } = useSession()
  const user = session?.user
  const [controls, showControls] = useState(false)
  const [preferences, setPreferences] = useState({})
  const [save, setSave] = useState(false)
  const [savedVision, setSavedVision] = useState(new_vision)
	const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }))
	const [loadingState, setLoadingState] = useState<
		{ status: 'loading' } | { status: 'ready' } | { status: 'error'; error: string }
	>({
		status: 'loading',
	})
  const [show, setShow] = useLocalStorage('showIntroVision', true)

  const updatePreferences = async () => {
    setSave(true)
    let updated = preferences
    updated['vision_board'] = savedVision
    const res = await fetch(`/api/update_preferences`, {
      body: JSON.stringify({ user, preferences: updated }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setTimeout(() => {
      setSave(false)
    }, 2000);
  }

  const getPreferences = async () => {
    const res = await fetch(`/api/get_preferences`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setPreferences(data)
    // if(data?.vision_board){
    //   store.loadSnapshot(data.vision_board)
    //   setSavedVision(data.vision_board)
    // } 
    // else {
    //   updatePreferences()
    // }
  }

	useEffect(() => {
    getPreferences()
    if(loadingState.status === 'ready'){
      // @ts-ignore
      if(user?.login_count > 1){
        setTimeout(() => {
          document.querySelectorAll('.tlui-layout__top__right').forEach(item => {
            item.classList.add('hidden');
          });
          document.querySelectorAll('.tlui-menu-zone__controls').forEach(item => {
            item.classList.add('hidden');
          });
        }, 250)
      }
      // @ts-ignore
      if(user?.login_count <= 1 && show){
        setShow(false)
      }
    }
  }, [loadingState])
	
	useLayoutEffect(() => {
		setLoadingState({ status: 'loading' })
    if (savedVision) {
			try {
				store.loadSnapshot(savedVision)
				setLoadingState({ status: 'ready' })
			} catch (error: any) {
				setLoadingState({ status: 'error', error: error.message }) // Something went wrong
			}
		} else {
			setLoadingState({ status: 'ready' }) // Nothing persisted, continue with the empty store
		}

		// Each time the store changes, run the (debounced) persist function
		const cleanupFn = store.listen(
			throttle(() => {
				const snapshot = store.getSnapshot()
        setSavedVision(snapshot)
			}, 1000)
		)
		return () => {
			cleanupFn()
		}
	}, [store])

	if (loadingState.status === 'loading') {
		return (
      <div style={{width: '75vw', height: '100vh'}}>
				<h2>Loading...</h2>
			</div>
		)
	}

	if (loadingState.status === 'error') {
		return (
      <div style={{width: '75vw', height: '100vh'}}>
        <h2>Error!</h2>
				<p>{loadingState.error}</p>
			</div>
		)
	} 

  const addControls = () => {
    if(!controls){
      showControls(true)
      document.querySelectorAll('.tlui-layout__top__right').forEach(item => {
        item.classList.remove('hidden');
      });
      document.querySelectorAll('.tlui-menu-zone__controls').forEach(item => {
        item.classList.remove('hidden');
      });
    } else {
      showControls(false)
      document.querySelectorAll('.tlui-layout__top__right').forEach(item => {
        item.classList.add('hidden');
      });
      document.querySelectorAll('.tlui-menu-zone__controls').forEach(item => {
        item.classList.add('hidden');
      });
    }
  }

	return (
		<div style={{width: '100%', height: '85vh'}}>
      {
        controls ?
        <button onClick={addControls} className="mr-2 items-center inline-flex w-full justify-center bg-pink-600 rounded-t-lg px-5 py-1.5 text-sm border-1 border-pink-600 font-semibold text-white shadow-sm hover:bg-pink-600 hover:text-white sm:w-auto">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-white mr-2" aria-hidden="true" />
          Hide Controls
        </button>
        :
        <button onClick={addControls} className="mr-2 items-center inline-flex w-full justify-center bg-pink-600 rounded-t-lg px-5 py-1.5 text-sm border-1 border-pink-600 font-semibold text-white shadow-sm hover:bg-pink-600 hover:text-white sm:w-auto">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-white mr-2" aria-hidden="true" />
          Show Controls
        </button>
      }
      <button onClick={updatePreferences} className="items-center inline-flex w-full justify-center bg-pink-600 rounded-t-lg px-5 py-1.5 text-sm border-1 border-pink-600 font-semibold text-white shadow-sm hover:bg-pink-600 hover:text-white sm:w-auto">
        { save ? <><CheckBadgeIcon className="h-4 w-4 text-white mr-2" aria-hidden="true" />Saved!</> : <><BookmarkIcon className="h-4 w-4 text-white mr-2" aria-hidden="true" />Save</>}
      </button>
			<Tldraw store={store} />
		</div>
	)
}
