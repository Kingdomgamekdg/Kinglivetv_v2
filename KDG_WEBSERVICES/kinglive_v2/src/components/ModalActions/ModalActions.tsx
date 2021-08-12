import React from 'react'
import styled from 'styled-components'

import Spacer from '../Spacer'
// import './index.less'

const ModalActions: React.FC = ({ children }) => {
	const l = React.Children.toArray(children).length
	return (
		<StyledModalActions>
			{React.Children.map(children, (child, i) => (
				<>
					<StyledModalAction className='bsc-modal-action'>{child}</StyledModalAction>
					{i < l - 1 && <Spacer />}
				</>
			))}
		</StyledModalActions>
	)
}

const StyledModalActions = styled.div`
	align-items: center;
	display: flex;
	margin: 0;
	padding: ${(props) => props.theme.spacing[4]}px;
	padding-top: 0px;
`

const StyledModalAction = styled.div`
	flex: 1;
	display: flex;
  justify-content: center;
  align-items: center;
`

export default ModalActions
