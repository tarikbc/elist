import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import EqualizerIcon from '@material-ui/icons/Equalizer';

// Styles
import { Container, MessageContainer } from './styles';

// Components
import TableCell from './components/TableCell'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: theme.spacing(4)
  },
  purple: {
    marginTop: theme.spacing(4),
    color: '#fff',
    backgroundColor: '#7159c1',
  },
  labelCell: {
    width: '250px',
  },
  customIcon: {
    fontSize: '128px', 
    color: '#CCCCCC', 
    backgroundColor: '#FAFAFA', 
    borderRadius: '155px', 
    padding: theme.spacing(4), 
    marginBottom: '18px'
  }
}));

const HeatMap = ({ sellers , totalSales, total, store}) => {
  const classes = useStyles();

  const [header, setHeader] = useState([[], [], []])
  const [content, setContent] = useState([])

  useEffect(() => {
    if (sellers) {
      setHeader(
        sellers.reduce((acc, curr, index) => {
            acc[0].push(
              <th style={{ marginBottom: '28px' }}>
                <p>{curr.sellerId.name.first} {curr.sellerId.name.last.substring(0, 1)}.</p>
                <Avatar className={classes.purple} alt={curr.sellerId.complete} src={curr.sellerId.photo?.url}>
                  {!curr.sellerId.photo.url && `${curr.sellerId.name.first.substring(0, 1)} ${curr.sellerId.name.last.substring(0, 1)}`}
                </Avatar>
              </th>
            )
            acc[1].push(
                <TableCell
                  value={curr.success + curr.fail}
                  style={{
                    height: '36px',
                  }}
                  reason="Total de atendimentos"
                  defaultCell
                />
            )
            acc[2].push(
                <TableCell
                  value={curr.success}
                  hasPercent
                  percent={Number((curr.success / (curr.success + curr.fail == 0 ? 1 : curr.success + curr.fail) * 100).toFixed(2))}
                  reason="Vendas"
                  backgroundColor={`rgba(39, 174, 96, ${Number(Math.log(curr.success * 100 / (curr.success + curr.fail)) / Math.log(100) * 100) / 100})`}
                />
            )
          return acc
        }, [
          [<th style={{ width: '240px', justifyContent: 'flex-end', paddingRight: '8px' }} />],
          [<td style={{ width: '240px', justifyContent: 'flex-end', paddingRight: '8px' }}><span>Atendimentos</span></td>],
          [<td style={{ width: '240px', justifyContent: 'flex-end', paddingRight: '8px' }}><span>Vendas</span></td>]
        ])
      )

      setContent(
        sellers.reduce((acc, curr) => {
            curr.events.forEach(event => {
              if (!event.success && event.selected?.title) {
                const failIndex = acc.findIndex(failEvent => failEvent.name === event.selected.title)
                if (failIndex >= 0) {
                  const sellerIndex = acc[failIndex].sellers.findIndex(seller => seller.sellerId === event.sellerId)

                  if (sellerIndex >= 0) {
                    acc[failIndex].sellers[sellerIndex].total++
                    acc[failIndex].total++
                  } 

                } else {
                  acc.push({
                    name: event.selected.title,
                    sellers: sellers.map(seller => ({
                      sellerId: seller.sellerId._id,
                      total: Number(seller.sellerId._id === event.sellerId),
                    })),
                    total: 1
                  })
                }
              }
            })
          return acc
        }, [])
      )
    }
  },[sellers])

  return (
    <Container>
          <thead>
            {header[0].length > 1 ? header.map((line, index) => (
              <tr key={index}>
                {index === 2 ? [...line, <TableCell defaultCell value={totalSales} reason={`Total (Vendas)`} />] : 
                 index === 1 ? [...line, <TableCell value={total} style={{height: '36px'}} reason="Total de atendimentos" defaultCell/>] : 
                // [...line, <td style={{ width: '75px' }}><span style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>Total</span></td>]}
                [...line, <th style={{ marginBottom: '28px' }}>
                  <p>{store ? store.name : '...'}</p>
                  <Avatar className={classes.purple} alt={store ? store.name : '...'} src={store?.photo?.url}/>
                </th>]}
              </tr>
            )) : 
            <MessageContainer>
              <EqualizerIcon className={classes.customIcon}/>
                <h1>Sem dados registrados</h1>
            </MessageContainer>
            }
          </thead>
          <tbody>
            {content.map((reason, index) => (
              <tr key={index}>
                <td style={{ width: '240px', justifyContent: 'flex-end', paddingRight: '8px' }}>
                  <span>{reason.name}</span>
                </td>
                {reason.sellers.map(a => (
                  <TableCell
                    value={a.total}
                    reason={reason.name}
                    percent={Number((a.total / (reason.total == 0 ? 1 : reason.total) * 100).toFixed(2))}
                    backgroundColor={`rgba(112, 44, 185, ${Number(Math.log(a.total * 100 / reason.total) / Math.log(100) * 100) / 100})`}
                  />
                ))}
                <TableCell 
                  value={reason.total}
                  reason={`Total (${reason.name})`}
                  defaultCell
                />
              </tr>
            ))}
          </tbody>
    </Container>
  )
}

HeatMap.propTypes = {
  sellers: PropTypes.array,
  totalSales: PropTypes.number,
}

export default HeatMap;