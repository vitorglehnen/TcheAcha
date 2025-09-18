import MapView, { CalloutSubview } from 'react-native-maps';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <MapView
                initialRegion={{
                    latitude: -29.795661701468216,
                    longitude: -51.86645934413101,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}

                style={styles.map} >
                <Marker
                    coordinate={{ latitude: -29.795661701468216, longitude: -51.86645934413101 }}
                >
                    <Image
                        source={{ uri: 'https://logodownload.org/wp-content/uploads/2015/05/internacional-porto-alegre-logo-escudo-4.png' }}
                        style={styles.marker}
                    />
                    <Callout>
                        <CalloutSubview>
                            <View style={styles.callout}>
                                <Text style={styles.calloutText}>Internacional - Porto Alegre</Text>
                            </View>
                        </CalloutSubview>

                    </Callout>
                </Marker>
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    marker: {
        width: 50,
        height: 50,
    },
    callout: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 150,
        minHeight: 50,
    },
    calloutText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});