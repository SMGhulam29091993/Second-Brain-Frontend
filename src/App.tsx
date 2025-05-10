import { Card } from './component/ui/card';

function App() {
    let link = 'https://www.youtube.com/watch?v=6t6ZYsLXMWU';
    let link2 = 'https://x.com/realDonaldTrump/status/1921174163848401313';
    return (
        <div className="flex items-center justify-center gap-2 h-screen">
            <Card title={'Test Card Youtube'} link={link} type={'youtube'} />
            <Card title={'Test Card Twitter/X'} link={link2} type={'twitter'} />
        </div>
    );
}

export default App;
