import React from 'react'
import { useAuth } from '../../hooks/useAuth'

const MechanicDashboard = () => {
    const { logout } = useAuth();
    return (
        <div>
            <h1>Mechanic Dashboard</h1>
            <button onClick={logout}>logout</button>
        </div>
    )
}

export default MechanicDashboard