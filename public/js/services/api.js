const Api = {
    url: 'https://jsonplaceholder.typicode.com/users',
    fetchPlayers: async () => {
        const result = await fetch(Api.url);
        return await result.json();
    }
}
export default Api;