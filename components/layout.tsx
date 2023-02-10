import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import layout from './layout.module.css'
import Link from 'next/link'

const name = 'Kursübersicht'

export default function Layout({children, home}: { children: any, home?: boolean }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <meta
                    name="description"
                    content="Kursübersicht Cevi Schweiz"
                />
                <meta name="twitter:card" content="summary_large_image"/>
            </Head>
            <header className={styles.header}>
                <>
                    <Image
                        priority
                        src="/images/logo.png"
                        className={layout.cevi_logo}
                        height={77}
                        width={475}
                        alt={name}
                    />
                    <h1 className={layout.page_header}>{name}</h1>
                </>
            </header>

            <main>{children}</main>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">← Back to home</Link>
                </div>
            )}
        </div>
    )
}
