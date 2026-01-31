/**
 * Button Examples
 * 
 * Demonstration of the Button component in various contexts
 */

import Button, {
    PrimaryButton,
    SecondaryButton,
    SuccessButton,
    DangerButton,
    LinkButton
} from "@/app/components/ui/Button";
import { useState } from "Reactor";

export default function ButtonExamples() {
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const handleAsyncAction = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setCount(count + 1);
    };

    return (
        <div className="p-10 space-y-12 max-w-4xl">
            <section>
                <h2 className="text-2xl font-bold mb-4">Variants</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="game">⬆</Button>
                    <Button variant="hero">Hero</Button>
                    <Button variant="glass">Glass</Button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Sizes</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">States</h2>
                <div className="flex flex-wrap gap-3">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button loading={loading} onClick={handleAsyncAction}>
                        {loading ? "Processing..." : `Click me (${count})`}
                    </Button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">With Icons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="success"
                        iconBefore={<span className="icon-[mdi--check]" />}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="primary"
                        iconAfter={<span className="icon-[mdi--arrow-right]" />}
                    >
                        Next
                    </Button>
                    <Button
                        variant="danger"
                        iconBefore={<span className="icon-[mdi--delete]" />}
                    >
                        Delete
                    </Button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Navigation</h2>
                <div className="flex flex-wrap gap-3">
                    <LinkButton href="/user/me">My Profile</LinkButton>
                    <Button href="/game/pong">Play Game</Button>
                    <Button variant="success" href="/tournament/start">
                        Join Tournament
                    </Button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Convenience Components</h2>
                <div className="flex flex-wrap gap-3">
                    <PrimaryButton>Primary Action</PrimaryButton>
                    <SecondaryButton>Alternative</SecondaryButton>
                    <SuccessButton>Save</SuccessButton>
                    <DangerButton>Delete</DangerButton>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Full Width</h2>
                <div className="space-y-3">
                    <Button variant="primary" fullWidth>
                        Full Width Primary
                    </Button>
                    <Button variant="secondary" fullWidth>
                        Full Width Secondary
                    </Button>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Real-World Examples</h2>
                <div className="space-y-6">
                    {/* Login form */}
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Login Form</h3>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-gray-700 px-4 py-2 rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-gray-700 px-4 py-2 rounded"
                            />
                            <Button variant="primary" size="lg" fullWidth>
                                Sign In
                            </Button>
                            <Button variant="secondary" size="sm" fullWidth>
                                Forgot Password?
                            </Button>
                        </div>
                    </div>

                    {/* Action confirmation */}
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm">
                        <h3 className="text-lg font-bold mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <SecondaryButton>Cancel</SecondaryButton>
                            <DangerButton>Delete</DangerButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
