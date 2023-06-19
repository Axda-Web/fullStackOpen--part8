import { createContext, useReducer, useContext, useEffect } from 'react';

const tokenReducer = (state, action) => {
	switch (action.type) {
		case 'SET_TOKEN':
			return action.payload;
		default:
			return state;
	}
};

const TokenContext = createContext();

export const useTokenValue = () => {
	const [tokenValue] = useContext(TokenContext);
	return tokenValue;
};

export const useTokenDispatch = () => {
	const [_, tokenDispatch] = useContext(TokenContext); // eslint-disable-line
	return tokenDispatch;
};

export const TokenContextProvider = ({ children }) => {
	const [token, tokenDispatch] = useReducer(tokenReducer, null);

	useEffect(() => {
		tokenDispatch({
			type: 'SET_TOKEN',
			payload: localStorage.getItem('library-user-token')
		});
	}, [tokenDispatch]);

	return (
		<TokenContext.Provider value={[token, tokenDispatch]}>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenContext;
