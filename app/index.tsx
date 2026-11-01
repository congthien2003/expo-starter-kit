import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth';
export default function Entry() { const { isAuthenticated } = useAuth(); return <Redirect href={isAuthenticated ? '/(tabs)/home' : '/login'} />; }
