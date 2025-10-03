import React, { useState } from 'react'
import { Container, Box, Grid, Button, TextField, Typography, Paper } from '@mui/material'

function formatResult(n) {
  	if (!isFinite(n)) return 'Error'
  	const s = Number(n.toPrecision(12)).toString()
  	return s
}

function calculate(a, b, op) {
  	switch (op) {
    		case '+': return a + b
    		case '-': return a - b
    		case '*': return a * b
    		case '/': return b === 0 ? Infinity : a / b
    		default:  return b
  	}
}

export default function App() {
  	const [displayValue, setDisplayValue] = useState('0')
  	const [firstOperand, setFirstOperand] = useState(null)
  	const [operator, setOperator] = useState(null)
  	const [awaitingSecond, setAwaitingSecond] = useState(false)
  	const [lastOperator, setLastOperator] = useState(null)
  	const [lastSecondOperand, setLastSecondOperand] = useState(null)

  	const handleDigit = (d) => {
    		setDisplayValue((prev) => {
      			if (awaitingSecond) {
        			setAwaitingSecond(false)
        			return String(d)
      			}
      			return prev === '0' ? String(d) : prev + String(d)
    		})
  	}

  	const handleDecimal = () => {
    		setDisplayValue((prev) => {
      			if (awaitingSecond) {
        			setAwaitingSecond(false)
        			return '0.'
      			}
      			return prev.includes('.') ? prev : prev + '.'
    		})
  	}

  	const chooseOperator = (op) => {
    		const input = parseFloat(displayValue)
    		if (firstOperand === null) {
      			setFirstOperand(input)
    		} else if (!awaitingSecond && operator) {
      			const result = calculate(firstOperand, input, operator)
      			setFirstOperand(result)
      			setDisplayValue(formatResult(result))
    		}
    		setOperator(op)
    		setAwaitingSecond(true)
    		setLastOperator(null)
    		setLastSecondOperand(null)
  	}

  	const handleEquals = () => {
    		const current = parseFloat(displayValue)

    		if (operator != null) {
      			const second = current
     	 		const result = calculate(firstOperand ?? 0, second, operator)
      			setDisplayValue(formatResult(result))
      			setFirstOperand(result)
      			setLastOperator(operator)
      			setLastSecondOperand(second)
      			setOperator(null)
      			setAwaitingSecond(true)
    		} else if (lastOperator != null && lastSecondOperand != null) {
      			// repeat last operation when = is pressed again
      			const base = current
      			const result = calculate(base, lastSecondOperand, lastOperator)
      			setDisplayValue(formatResult(result))
      			setFirstOperand(result)
      			setAwaitingSecond(true)
    		}
  	}

  	const handleClear = () => {
    		setDisplayValue('0')
    		setFirstOperand(null)
    		setOperator(null)
    		setAwaitingSecond(false)
    		setLastOperator(null)
    		setLastSecondOperand(null)
  	}

  	const buttons = [
    		{ label: 'AC', onClick: handleClear },
    		{ label: '÷', onClick: () => chooseOperator('/') },
    		{ label: '×', onClick: () => chooseOperator('*') },
    		{ label: '−', onClick: () => chooseOperator('-') },

    		{ label: '7', onClick: () => handleDigit(7) },
    		{ label: '8', onClick: () => handleDigit(8) },
    		{ label: '9', onClick: () => handleDigit(9) },
    		{ label: '+', onClick: () => chooseOperator('+') },

    		{ label: '4', onClick: () => handleDigit(4) },
    		{ label: '5', onClick: () => handleDigit(5) },
    		{ label: '6', onClick: () => handleDigit(6) },
    		{ label: '=', onClick: handleEquals, color: 'primary', variant: 'contained' },

    		{ label: '1', onClick: () => handleDigit(1) },
    		{ label: '2', onClick: () => handleDigit(2) },
    		{ label: '3', onClick: () => handleDigit(3) },
    		{ label: '.', onClick: handleDecimal },

    		{ label: '0', onClick: () => handleDigit(0), wide: true },
  	]

  	return (
    		<Container maxWidth="sm" sx={{ py: 6 }}>
      			<Paper elevation={6} className="calculatorCard">
        			<Box p={3}>
          				<Typography variant="h5" mb={2} align="center">Lab 4 – React Calculator</Typography>

          				<TextField
            					value={displayValue}
            					fullWidth
            					inputProps={{ readOnly: true, style: { textAlign: 'right', fontSize: '2rem', fontFamily: 'monospace' } }}
            					variant="outlined"
            					aria-label="display"
            					className="displayField"
          				/>

          				<Box mt={2}>
            					<Grid container spacing={1}>
              						{buttons.map((b, idx) => (
                						<Grid
                  							item
                  							xs={b.wide ? 9 : 3}
                  							key={idx}
                						>
                  							<Button
                    								fullWidth
                    								size="large"
                    								onClick={b.onClick}
                    								variant={b.variant || 'outlined'}
                    								color={b.color || 'inherit'}
                    								className={b.label === 'AC' ? 'btn-ac' : ''}
                  							>
                    								{b.label}
                  							</Button>
                						</Grid>
              						))}
            					</Grid>
          				</Box>
        			</Box>
      			</Paper>
    		</Container>
  	)
}

