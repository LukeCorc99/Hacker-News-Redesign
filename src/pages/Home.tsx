import { useState } from 'react'
import { QueryProvider } from '../providers/QueryProvider'
import { Header } from '../components/Header'
import { PostList } from '../components/PostList'
import type { FeedType, ViewMode } from '../components/PostList'
import { AuthModal } from '../components/AuthModal'
import { SubmitPostModal } from '../components/SubmitPostModal'

type AuthAction = 'login' | 'register' | null

function HomeContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authAction, setAuthAction] = useState<AuthAction>(null)
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
    const [feedType, setFeedType] = useState<FeedType>('top')
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [shouldOpenSubmitAfterLogin, setShouldOpenSubmitAfterLogin] = useState(false)

    const handleLogin = (action: 'login' | 'register') => {
        setAuthAction(action)
        setShouldOpenSubmitAfterLogin(false)
    }

    const handleSubmit = () => {
        if (!isLoggedIn) {
            setShouldOpenSubmitAfterLogin(true)
            setAuthAction('login')
            return
        }
        setIsSubmitModalOpen(true)
    }

    const handleCloseAuth = () => {
        setAuthAction(null)
    }

    const handleCloseSubmit = () => {
        setIsSubmitModalOpen(false)
    }

    const handleAuthSuccess = () => {
        setIsLoggedIn(true)
        setAuthAction(null)
        if (shouldOpenSubmitAfterLogin) {
            setIsSubmitModalOpen(true)
            setShouldOpenSubmitAfterLogin(false)
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    return (
        <>
            <Header
                onLogin={handleLogin}
                onSubmit={handleSubmit}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
            />
            <PostList
                feedType={feedType}
                viewMode={viewMode}
                onChangeFeedType={setFeedType}
                onChangeViewMode={setViewMode}
            />
            {authAction && (
                <AuthModal action={authAction} onClose={handleCloseAuth} onSuccess={handleAuthSuccess} />
            )}
            {isSubmitModalOpen && <SubmitPostModal onClose={handleCloseSubmit} />}
        </>
    )
}

export default function Home() {
    return (
        <QueryProvider>
            <HomeContent />
        </QueryProvider>
    )
}