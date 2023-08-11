import { Tldraw, defaultShapeUtils, createTLStore, throttle } from '@tldraw/tldraw'
import { useLayoutEffect, useState, useEffect } from 'react';
import { vision, new_vision } from '../utils/default-vision'
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
const PERSISTENCE_KEY = 'vision_board'

export default function Editor() {
  const { data: session } = useSession()
  const user = session?.user
	const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }))
	const [loadingState, setLoadingState] = useState<
		{ status: 'loading' } | { status: 'ready' } | { status: 'error'; error: string }
	>({
		status: 'loading',
	})
  const [show, setShow] = useLocalStorage('showIntroVision', true)

	useEffect(() => {
    if(loadingState.status === 'ready'){
      setTimeout(() => {
        document.querySelectorAll('.tlui-layout__top__right').forEach(item => {
          item.classList.add('hidden');
        });
        document.querySelectorAll('.tlui-menu-zone__controls').forEach(item => {
          item.classList.add('hidden');
        });
      }, 250);
      // @ts-ignore
      if(user?.login_count <= 1 && show){
        setShow(false)
      }
    }
  }, [loadingState])
	
	useLayoutEffect(() => {
		setLoadingState({ status: 'loading' })
    // @ts-ignore
    let defaultVision = user?.login_count <= 1 && show ? new_vision : vision
		// Get persisted data from local storage
		const persistedSnapshot =  localStorage.getItem(PERSISTENCE_KEY) || defaultVision
		if (persistedSnapshot) {
			try {
				const snapshot = JSON.parse(persistedSnapshot)
				store.loadSnapshot(snapshot)
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
				localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot))
			}, 500)
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

	return (
		<div style={{width: '100%', height: '85vh'}}>
			<Tldraw store={store} />
		</div>
	)
}
