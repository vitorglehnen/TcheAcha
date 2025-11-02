import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const requestPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch (err) {
            setError(err);
            return false;
        }
    };

    const getLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            const hasPermission = await requestPermission();

            if (!hasPermission) {
                setError('Permissão negada');
                setLoading(false);
                return null;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            setLocation(currentLocation);
            setLoading(false);
            return currentLocation;
        } catch (err) {
            setError(err);
            setLoading(false);
            return null;
        }
    }

    return { location, loading, error, getLocation, requestPermission };
};