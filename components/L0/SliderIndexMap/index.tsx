import React from 'react'
import styles from './styles.module.scss'

export default ({
	className = '',
	children
}) => {
	return (
		<div className={`sliderindexmap ${className} ${styles["sliderindexmap"]}`}>
			{children}
		</div>
	)
}