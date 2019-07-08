import React, { Component } from 'react';
import Tile from './Tile';
import Btn from './Btn';

const PADDING_SIZE = Number(process.env.REACT_APP_PADDING_SIZE);

export default class Square extends Component {
	constructor(props) {
		super(props);

		const { initialHeight, initialWidth, cellSize } = this.props;

		this.state = {
			square: [],
			squareHeight: initialHeight,
			squareWidth: initialWidth,
			cellSize,
			posCol: 0,
			posRow: 0,
			iCol: 0,
			iRow: 0,
		};
	}

	componentDidMount() {
		this._buildSquare();
	}

	/**
	 * Check position btns minus
	 *
	 * @param iRow
	 * @param iCol
	 * @param cellSize
	 */
	checkPosition = (
		iRow = this.state.iRow,
		iCol = this.state.iCol,
		cellSize = this.state.cellSize
	) => {
		this.setState({
			...this.state,
			posCol: cellSize * iCol + PADDING_SIZE * iCol,
			posRow: cellSize * iRow + PADDING_SIZE * iRow,
			iCol,
			iRow,
		});
	};

	/**
	 * Build square
	 *
	 * @private
	 */
	_buildSquare = () => {
		let square = [];
		const { squareHeight, squareWidth } = this.state;

		for (let row = 0; row < squareHeight; row++) {
			let tiles = [];
			for (let col = 0; col < squareWidth; col++) {
				tiles.push(this._setTile(row, col));
			}
			square[row] = {
				tiles,
			};
		}

		this.setState({
			...this.state,
			square,
		});
	};

	/**
	 * Set params for tile
	 *
	 * @param row
	 * @param col
	 * @param cellSize
	 * @returns {*}
	 * @private
	 */
	_setTile = (row, col, cellSize = this.state.cellSize) => (
		<Tile
			key={`${row}-${col}`}
			cellSize={cellSize}
			row={row}
			col={col}
			checkPosition={this.checkPosition}
		/>
	);

	/**
	 *
	 * @private
	 */
	_addCol = () => {
		const { squareWidth: col } = this.state;
		let square = [...this.state.square];

		square.map((row, index) => {
			row.tiles.push(this._setTile(index, col));
			return row;
		});

		this.setState({
			...this.state,
			square,
			squareWidth: col + 1,
		});
	};

	/**
	 *
	 * @private
	 */
	_addRow = () => {
		const { squareHeight: row, squareWidth } = this.state;

		let square = [...this.state.square];
		let tiles = [];

		for (let col = 0; col < squareWidth; col++) {
			tiles.push(this._setTile(row, col));
		}

		square[row] = {
			tiles,
		};

		this.setState({
			...this.state,
			square,
			squareHeight: row + 1,
		});
	};

	/**
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	_removeCol = async () => {
		const { iCol, squareWidth } = this.state;
		let square = [...this.state.square];

		square.map(row => row.tiles.filter((tile, index) => index !== iCol));

		await this.setState({
			...this.state,
			square,
			squareWidth: squareWidth - 1,
		});

		this._buildSquare();
	};

	/**
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	_removeRow = async () => {
		const { square, iRow, squareHeight } = this.state;

		await this.setState({
			...this.state,
			square: square.filter((row, index) => index !== iRow),
			squareHeight: squareHeight - 1,
		});

		this._buildSquare();
	};

	render() {
		const {
			square,
			posCol,
			posRow,
			squareWidth,
			squareHeight,
			cellSize,
		} = this.state;

		const btnRemoveCol =
			squareWidth > 1 ? (
				<Btn
					cellSize={cellSize}
					type="minus-row"
					onClick={this._removeCol}
					posCol={posCol}
					posRow={posRow}
					paddingSize={PADDING_SIZE}
				/>
			) : (
				''
			);
		const btnRemoveRow =
			squareHeight > 1 ? (
				<Btn
					cellSize={cellSize}
					type="minus-col"
					onClick={this._removeRow}
					posCol={posCol}
					posRow={posRow}
					paddingSize={PADDING_SIZE}
				/>
			) : (
				''
			);

		return (
			<div className="square">
				<div className="tiles__wrapper">
					{square.map((row, index) => (
						<div key={`row-${index}`} className="row">
							{row.tiles.map(tile => tile)}
						</div>
					))}

					{btnRemoveCol}
					{btnRemoveRow}
				</div>

				<Btn
					cellSize={cellSize}
					type="plus-row"
					onClick={this._addRow}
					paddingSize={PADDING_SIZE}
				/>
				<Btn cellSize={cellSize} type="plus-col" onClick={this._addCol} />
			</div>
		);
	}
}
