import React from 'react'
import styles from './styles.module.scss'

export default ({
	className = '',
	text = ''
}) => {
	return (
		<div className={`message ${className} ${styles["message"]}`}>
			{text}
		</div>
	)
}