import React from 'react'
import styles from './styles.module.scss'

export default ({
	className = '',
	children
}) => {
	return (
		<div className={`dotsindexmap ${className} ${styles["dotsindexmap"]}`}>
			{children}
		</div>
	)
}