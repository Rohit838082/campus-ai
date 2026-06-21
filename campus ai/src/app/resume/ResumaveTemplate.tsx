import React from 'react';
import { ResumeDraft, parseBlocks, splitLines } from './ResumeClient';

const styles = {
    page: {
        backgroundColor: '#ffffff',
        color: '#333',
        fontFamily: "'Times New Roman', Times, serif",
    },
    header__name: {
        color: '#111',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center' as const,
        textTransform: 'uppercase' as const,
    },
    header__links: {
        color: '#555',
        fontSize: 11,
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'center',
        flexWrap: 'wrap' as const,
        gap: 14,
        marginTop: 6,
        marginBottom: 4,
    },
    title_wrapper: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
    },
    subTitle_wrapper: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 11,
        marginTop: 2,
    },
    title: {
        fontWeight: 'bold',
        marginRight: 'auto',
        color: '#222',
    },
    date: {
        fontStyle: 'italic',
        fontSize: 11,
        color: '#555',
    },
    line: {
        borderBottom: '1px solid #e5e7eb',
        margin: '6px 0px',
    },
    lists: {
        fontSize: 10.5,
        marginTop: 4,
        lineHeight: 1.4,
    },
    link: {
        color: '#444',
        textDecoration: 'none',
    },
    section_title: {
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        color: '#111',
    },
    section_title_underline: {
        borderBottom: '1px solid #aaa',
        marginTop: 2,
        marginBottom: 6,
    },
    section_end: {
        marginBottom: 12,
    },
    wrapper: {
        marginBottom: 6,
    },
    row: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'flex-start',
    },
    bullet: {
        marginRight: 6,
        lineHeight: 1.4,
    }
};

const View = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => <div style={style}>{children}</div>;
const Text = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => <div style={style}>{children}</div>;
const Link = ({ children, src, style }: { children: React.ReactNode; src?: string; style?: React.CSSProperties }) => (
    <a href={src} style={style}>
        {children}
    </a>
);

const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => {
    return (
        <View>
            {title && (
                <>
                    <Text style={styles.section_title}>{title}</Text>
                    <View style={styles.section_title_underline}></View>
                </>
            )}
            {children}
            <View style={styles.section_end}></View>
        </View>
    );
};

const ListItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={styles.row}>
            <div style={styles.bullet}>
                <span>{'\u2022'}</span>
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
};

const Header = ({ draft }: { draft: ResumeDraft }) => {
    const contactLinks = [
        { name: draft.phone, value: draft.phone ? `tel:${draft.phone.replace(/\s/g, '')}` : '' },
        { name: draft.email, value: draft.email ? `mailto:${draft.email}` : '' },
        { name: draft.address, value: draft.address ? '#' : '' },
        { name: draft.linkedin?.replace(/^https?:\/\//i, '').replace(/\/$/, ''), value: draft.linkedin ? (draft.linkedin.startsWith('http') ? draft.linkedin : `https://${draft.linkedin}`) : '' },
        { name: draft.github?.replace(/^https?:\/\//i, '').replace(/\/$/, ''), value: draft.github ? (draft.github.startsWith('http') ? draft.github : `https://${draft.github}`) : '' },
        { name: draft.portfolio?.replace(/^https?:\/\//i, '').replace(/\/$/, ''), value: draft.portfolio ? (draft.portfolio.startsWith('http') ? draft.portfolio : `https://${draft.portfolio}`) : '' },
    ];

    return (
        <Section>
            <Text style={styles.header__name}>{draft.fullName || 'Your Name'}</Text>
            {draft.headline && <Text style={{ ...styles.date, textAlign: 'center', marginTop: 4, fontStyle: 'normal' }}>{draft.headline}</Text>}
            <View style={styles.header__links}>
                {contactLinks
                    .filter(obj => obj.name && obj.value)
                    .map(({ value, name }, i) => (
                        <Link key={i} src={value} style={styles.link}>
                            {name}
                        </Link>
                    ))}
            </View>
        </Section>
    );
};

const Education = ({ text }: { text: string }) => {
    const blocks = parseBlocks(text);
    return (
        <Section title={'Education'}>
            {blocks.map((block, i) => (
                <View key={i} style={styles.wrapper}>
                    <View style={styles.title_wrapper}>
                        <Text style={styles.title}>{block.title.left}</Text>
                        <Text style={styles.date}>{block.title.right}</Text>
                    </View>

                    {(block.subtitle.left || block.subtitle.right) && (
                        <View style={styles.subTitle_wrapper}>
                            <Text style={{ fontStyle: 'italic', fontSize: 11 }}>{block.subtitle.left}</Text>
                            <Text style={styles.date}>{block.subtitle.right}</Text>
                        </View>
                    )}

                    {block.bullets.length > 0 && (
                        <View style={styles.lists}>
                            {block.bullets.map((bullet, i) => (
                                <ListItem key={i}>{bullet}</ListItem>
                            ))}
                        </View>
                    )}

                    {i !== blocks.length - 1 && <View style={styles.line} />}
                </View>
            ))}
        </Section>
    );
};

const Projects = ({ text }: { text: string }) => {
    const blocks = parseBlocks(text);
    return (
        <Section title={'Projects'}>
            {blocks.map((block, i) => (
                <View key={i} style={styles.wrapper}>
                    <View style={styles.title_wrapper}>
                        <Text style={styles.title}>{block.title.left}</Text>
                        <Text style={styles.date}>{block.title.right}</Text>
                    </View>

                    {(block.subtitle.left || block.subtitle.right) && (
                        <View style={styles.subTitle_wrapper}>
                            <Link style={styles.link} src={block.subtitle.left?.startsWith('http') ? block.subtitle.left : `https://${block.subtitle.left}`}>
                                {block.subtitle.left || block.subtitle.right}
                            </Link>
                        </View>
                    )}

                    {block.bullets.length > 0 && (
                        <View style={styles.lists}>
                            {block.bullets.map((bullet, i) => (
                                <ListItem key={i}>{bullet}</ListItem>
                            ))}
                        </View>
                    )}

                    {i !== blocks.length - 1 && <View style={styles.line} />}
                </View>
            ))}
        </Section>
    );
};

const Experience = ({ text }: { text: string }) => {
    const blocks = parseBlocks(text);
    return (
        <Section title={'Experience'}>
            {blocks.map((block, i) => (
                <View key={i} style={styles.wrapper}>
                    <View style={styles.title_wrapper}>
                        <Text style={styles.title}>{block.title.left}</Text>
                        <Text style={styles.date}>{block.title.right}</Text>
                    </View>

                    {(block.subtitle.left || block.subtitle.right) && (
                        <View style={styles.subTitle_wrapper}>
                            <Text style={{ fontStyle: 'italic', fontSize: 11 }}>{block.subtitle.left}</Text>
                            <Text style={styles.date}>{block.subtitle.right}</Text>
                        </View>
                    )}

                    {block.bullets.length > 0 && (
                        <View style={styles.lists}>
                            {block.bullets.map((bullet, i) => (
                                <ListItem key={i}>{bullet}</ListItem>
                            ))}
                        </View>
                    )}
                    {i !== blocks.length - 1 && <View style={styles.line} />}
                </View>
            ))}
        </Section>
    );
};

const Skills = ({ text }: { text: string }) => {
    const lines = splitLines(text);
    return (
        <Section title={'Skills'}>
            {lines.map((line, i) => {
                const [label, ...rest] = line.split(":");
                const value = rest.join(":").trim();
                return (
                    <Text key={i} style={{ fontSize: 11, marginBottom: 4, lineHeight: 1.4 }}>
                        {value ? <span><span style={{ fontWeight: 'bold' }}>{label.trim()}:</span> {value}</span> : line}
                    </Text>
                )
            })}
        </Section>
    );
};

const Certificates = ({ text }: { text: string }) => {
    const blocks = parseBlocks(text);
    return (
        <Section title={'Certifications'}>
            {blocks.map((block, i) => (
                <View key={i} style={styles.wrapper}>
                    <View style={styles.title_wrapper}>
                        <Text style={styles.title}>{block.title.left}</Text>
                        <Text style={styles.date}>{block.title.right}</Text>
                    </View>

                    {(block.subtitle.left || block.subtitle.right) && (
                        <View style={styles.subTitle_wrapper}>
                            <Text style={{ fontStyle: 'italic', fontSize: 11 }}>{block.subtitle.left}</Text>
                        </View>
                    )}

                    {i !== blocks.length - 1 && <View style={styles.line} />}
                </View>
            ))}
        </Section>
    );
};

const Languages = ({ text }: { text: string }) => {
    const lines = splitLines(text);
    return (
        <Section title={'Languages'}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                {lines.map((line, i) => {
                    const [left, ...rest] = line.split("|");
                    const right = rest.join("|").trim();
                    return (
                        <View key={i} style={{ marginBottom: 4 }}>
                            <Text style={{ fontSize: 11 }}>
                                <span style={{ fontWeight: 'bold' }}>{left.trim()}</span>
                                {right && <span style={{ color: '#555' }}> - {right}</span>}
                            </Text>
                        </View>
                    )
                })}
            </View>
        </Section>
    );
};

export function ResumaveTemplate({ draft }: { draft: ResumeDraft }) {
    return (
        <article className="resume-sheet min-h-[1123px] w-[794px] bg-white text-black shadow-sm px-12 py-12" style={styles.page}>
            <Header draft={draft} />

            {draft.summary && (
                <Section title={'Summary'}>
                    <Text style={{ fontSize: 10.8, lineHeight: 1.4 }}>{draft.summary}</Text>
                </Section>
            )}

            {draft.education && <Education text={draft.education} />}
            {draft.experience && <Experience text={draft.experience} />}
            {draft.projects && <Projects text={draft.projects} />}

            {draft.skills && <Skills text={draft.skills} />}
            {draft.certificates && <Certificates text={draft.certificates} />}
            {draft.languages && <Languages text={draft.languages} />}
        </article>
    );
}
