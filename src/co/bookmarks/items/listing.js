import React from 'react'
import List from '~co/virtual/list'
import Grid from '~co/virtual/grid'
import Masonry from '~co/virtual/masonry'
import config from '../config'

import Item from '../item'
import Empty from '../empty'
import Header from '../header'
import Footer from '../footer'
import Section from '../section'

export default class BookmarksItemsListing extends React.Component {
    state = {
        itemsCheckpoint: 0
    }

    _list = React.createRef()

    componentDidUpdate(prev) {
        if (prev.items != this.props.items)
            this.setState({ itemsCheckpoint: this.state.itemsCheckpoint+1 })

        if (prev.activeId != this.props.activeId)
            this.scrollToActive()
    }

    componentDidMount() {
        this.scrollToActive()
    }

    scrollToActive = ()=>{
        setTimeout(() => {
            if (this.props.activeId && this._list.current)
                this._list.current.scrollToIndex(
                    this.props.items.indexOf(parseInt(this.props.activeId))
                )
        }, 300)
    }

    computeItemKey = (index)=>
        this.props.items[index]

    endReached = ()=>
        this.props.actions.nextPage(this.props.cid)

    renderItem = (index)=>{
        const _id = this.props.items[index]

        if (typeof _id == 'string')
            return (
                <Section 
                    key={_id}
                    type={_id} />
            )

        return (
            <Item
                key={_id}
                _id={_id}
                //collection
                cid={this.props.cid}
                view={this.props.view}
                access={this.props.access}
                selectModeEnabled={this.props.selectModeEnabled}
                reorderable={this.props.sort=='sort'}
                //listing specififc
                active={this.props.activeId == _id}
                events={this.props.events}
                actions={this.props.actions} />
        )
    }

    renderEmpty = ()=>(
        <Empty cid={this.props.cid} compact={this.props.compact} />
    )

    renderHeader = ()=>(
        <Header cid={this.props.cid} compact={this.props.compact} />
    )

    renderFooter = ()=>(
        <Footer 
            cid={this.props.cid}
            compact={this.props.compact}
            more={this.props.items.length > config.compact.count} />
    )

    render() {
        const { items, view, activeId, selectModeEnabled, compact } = this.props

        let Component

        switch(view) {
            case 'grid':
                Component = Grid
            break

            case 'masonry':
                Component = Masonry
            break

            default:
                Component = List
            break
        }

        return (
            <Component
                ref={this._list}
                className={`elements view-${view} ${selectModeEnabled&&'select-mode'}`}
                dataKey={activeId+selectModeEnabled+view+this.state.itemsCheckpoint} //force re-render

                item={this.renderItem}
                header={this.renderHeader}
                empty={this.renderEmpty}
                footer={this.renderFooter}
                computeItemKey={this.computeItemKey}

                totalCount={compact ? Math.min(items.length, config.compact.count) : items.length}
                columnWidth={config.size[view].cover.width}
                stickyHeader={true}
                disableVirtualization={compact}
                
                endReached={this.endReached} 
                />
        )
    }
}