import { Link } from 'react-router-dom';
import Screen from '../components/Screen';
import Content from '../components/Content';
import Navbar from '../components/Navbar';
// import { useGetAnalytics } from "../hooks/useAnalytics";
import Loading from "../icons/Loading";
import PatternImage from '../assets/images/pattern.jpg';

export default function Dashboard() {
	// const { analytics } = useGetAnalytics();

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					
					<h1>This is dashboard</h1>
					{/* <section className='xui-mb-3'>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? analytics.data.total_users.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Users</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>$ {analytics.data.transactions_amount_sum[0].total_amount ? analytics.data.transactions_amount_sum[0].total_amount.toLocaleString() : "0"} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Transactions</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.total_balances.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>User Total Balances</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.total_payment_balances.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>User Total Payment Balances</span>
								</div>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.transaction_analytics.user_completed_deposits.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>User Completed Deposits</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.transaction_analytics.user_completed_withdrawals.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>User Completed Withdrawals</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.transaction_analytics.commissions.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Commissions</span>
								</div>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.transaction_analytics.user_cancelled_deposits.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>User Cancelled Deposits</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.transaction_analytics.user_cancelled_withdrawals.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>User Cancelled Withdrawals</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? <span>&#x20A6; {analytics.data.transaction_analytics.purchases.toLocaleString()} </span> : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Purchases</span>
								</div>
							</div>
						</div>

						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? analytics.data.total_orders.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Orders</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? analytics.data.total_products.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Products</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? analytics.data.total_categories.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Categories</span>
								</div>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? analytics.data.total_favorites.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Favorites</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? analytics.data.total_disputes.toLocaleString() : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Disputes</span>
								</div>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>{analytics ? (analytics.data.product_views_sum[0].total_views ? analytics.data.product_views_sum[0].total_views.toLocaleString() : "None") : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Product Views</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>$ {analytics ? (analytics.data.order_amount_sum[0].total_amount ? analytics.data.order_amount_sum[0].total_amount.toLocaleString() : "0") : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Order Amount Sum</span>
								</div>
							</div>
							<div className='xui-bg-pos-center xui-bg-sz-cover xui-bdr-rad-half xui-overflow-hidden' style={{ backgroundImage: `url(${PatternImage})` }}>
								<div className='xui-py-1 xui-px-2 xui-overlay xui-h-fluid-100'>
									<h3 className='xui-font-sz-180 xui-font-w-normal'>$ {analytics ? (analytics.data.order_shipping_fee_sum[0].total_shipping_fee ? analytics.data.order_shipping_fee_sum[0].total_shipping_fee.toLocaleString() : "0") : <Loading width="12" height="12" />}</h3>
									<span className='xui-font-sz-90'>Order Shipping Fee Sum</span>
								</div>
							</div>
						</div>
					</section> */}
				</Content>
			</Screen>
		</>
	);
}